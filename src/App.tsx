import React, { useState, useEffect, useCallback } from 'react';
import { useMortgages } from './hooks/useMortgages';
import { useFloridaPermits } from './hooks/useFloridaPermits';
import { useCarriers } from './hooks/useCarriers';
import { Header } from './components/Header';
import { SearchFilterBar } from './components/SearchFilterBar';
import { MortgageList } from './components/MortgageList';
import { MortgageDetail } from './components/MortgageDetail';
import { MortgageFormModal } from './components/MortgageFormModal';
import { PermitFilterBar } from './components/PermitFilterBar';
import { PermitList } from './components/PermitList';
import { PermitDetail } from './components/PermitDetail';
import { PermitFormModal } from './components/PermitFormModal';
import { PermitImportModal } from './components/PermitImportModal';
import { CarrierFilterBar } from './components/CarrierFilterBar';
import { CarrierList } from './components/CarrierList';
import { CarrierDetailModal } from './components/CarrierDetailModal';
import { CarrierFormModal } from './components/CarrierFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ImportModal } from './components/ImportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { DisclaimerView } from './components/DisclaimerView';
import { BulkLinkModal } from './components/BulkLinkModal';
import { ToastContainer } from './components/Toast';
import { QuickViewModal } from './components/QuickViewModal';
import { PolicyEmailModal } from './components/PolicyEmailModal';
import { FeedbackModal, SubmissionType } from './components/FeedbackModal';
import { MortgageRecord } from './types/mortgage';
import { CarrierRecord } from './types/carrier';
import {
  FloridaZipRecord,
  DirectoryMode,
  BulkScopeMode,
  BulkUpdateLinksOptions
} from './types/permits';
import { getRecordId, isLossPayee, buildMortgageeClause } from './utils/formatters';
import { getPermitRecordId, formatZipCode } from './utils/permitFormatters';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { parseUrlHash, syncUrlHash, getShareableUrl } from './utils/urlState';
import { updateDynamicSeo } from './utils/seo';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { ViewSettingsBar } from './components/ViewSettingsBar';
import { ShieldCheck, LogOut, Link as LinkIcon, Building2, MapPin, Shield } from 'lucide-react';

function DirectoryApp() {
  const { t, language, setLanguage, isSpanish } = useLanguage();
  const { enableShortcuts, fontSize } = usePreferences();

  // Mortgage Directory State & Methods
  const mortgage = useMortgages();

  // Florida Property & Permits Directory State & Methods
  const permit = useFloridaPermits(mortgage.addToast);

  // Insurance Carriers Directory State & Methods
  const carrier = useCarriers(mortgage.addToast);

  // Active Tab: 'mortgages' | 'property' | 'carriers' | 'disclaimer'
  const [activeTab, setActiveTab] = useState<DirectoryMode>(() => {
    try {
      const urlState = parseUrlHash();
      if (urlState.tab) return urlState.tab;
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('disclaimer') || hash.includes('terms') || hash.includes('legal')) {
        return 'disclaimer';
      }
      if (hash.includes('carrier')) {
        return 'carriers';
      }
      if (hash.includes('property') || hash.includes('permit') || hash.includes('appraiser')) {
        return 'property';
      }
    } catch {
      // ignore
    }
    return 'mortgages';
  });

  // Dynamic SEO, Meta Tags, Canonical Link, Robots Meta, & Schema.org JSON-LD structured data update
  useEffect(() => {
    updateDynamicSeo(
      activeTab,
      activeTab === 'mortgages' ? mortgage.selectedRecord : null,
      activeTab === 'property' ? permit.selectedRecord : null
    );
  }, [
    activeTab,
    mortgage.selectedRecord,
    permit.selectedRecord
  ]);

  // Operational Mode: Public (Read-Only) vs Admin (Protected Backend Management)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('agency_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMortgageFormOpen, setIsMortgageFormOpen] = useState(false);
  const [isMortgageDuplicate, setIsMortgageDuplicate] = useState(false);
  const [editingMortgageRecord, setEditingMortgageRecord] = useState<MortgageRecord | null>(null);
  const [isMortgageImportOpen, setIsMortgageImportOpen] = useState(false);
  const [deleteMortgageTargetId, setDeleteMortgageTargetId] = useState<string | null>(null);

  const [isPermitFormOpen, setIsPermitFormOpen] = useState(false);
  const [isPermitDuplicate, setIsPermitDuplicate] = useState(false);
  const [editingPermitRecord, setEditingPermitRecord] = useState<FloridaZipRecord | null>(null);
  const [isPermitImportOpen, setIsPermitImportOpen] = useState(false);
  const [deletePermitTargetId, setDeletePermitTargetId] = useState<string | null>(null);

  const [isCarrierFormOpen, setIsCarrierFormOpen] = useState(false);
  const [isCarrierDuplicate, setIsCarrierDuplicate] = useState(false);
  const [editingCarrierRecord, setEditingCarrierRecord] = useState<CarrierRecord | null>(null);

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Bulk Links Modal state
  const [isBulkLinkOpen, setIsBulkLinkOpen] = useState(false);
  const [bulkInitialScope, setBulkInitialScope] = useState<BulkScopeMode>('city');
  const [bulkInitialCity, setBulkInitialCity] = useState('');
  const [bulkInitialCounty, setBulkInitialCounty] = useState('');

  // In-page QuickView Details Modal state
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Policy Document Email Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalRecord, setEmailModalRecord] = useState<MortgageRecord | null>(null);

  // User Suggestion / Correction Feedback Modal state (Direct to Directory Admin)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackInitialType, setFeedbackInitialType] = useState<SubmissionType>('correct_mortgage');
  const [feedbackInitialEntity, setFeedbackInitialEntity] = useState<string>('');
  const [feedbackInitialDetails, setFeedbackInitialDetails] = useState<string>('');
  const [feedbackInitialRecordId, setFeedbackInitialRecordId] = useState<string>('');

  const handleOpenFeedback = (
    type?: SubmissionType,
    entityName: string = '',
    details: string = '',
    recordId: string = ''
  ) => {
    const resolvedType: SubmissionType =
      type || (activeTab === 'property' ? 'correct_permit' : 'correct_mortgage');
    setFeedbackInitialType(resolvedType);
    setFeedbackInitialEntity(entityName);
    setFeedbackInitialDetails(details);
    setFeedbackInitialRecordId(recordId);
    setIsFeedbackModalOpen(true);
  };

  // Deep link handler from URL hash on mount & hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const urlState = parseUrlHash();
      if (urlState.tab && urlState.tab !== activeTab) {
        setActiveTab(urlState.tab);
      }
      if (urlState.lang && (urlState.lang === 'en' || urlState.lang === 'es')) {
        setLanguage(urlState.lang);
      }
      if (urlState.q) {
        if (urlState.tab === 'property') {
          permit.setSearchQuery(urlState.q);
        } else if (urlState.tab === 'carriers') {
          carrier.setSearchQuery(urlState.q);
        } else {
          mortgage.setSearchQuery(urlState.q);
        }
      }
      if (urlState.id) {
        if (urlState.tab === 'property') {
          const exists = permit.records.some((r) => getPermitRecordId(r) === urlState.id);
          permit.setSelectedId(urlState.id);
          if (!exists && permit.records.length > 0) {
            mortgage.addToast(
              isSpanish ? 'Registro No Encontrado' : 'Property Record Not Found',
              isSpanish ? `No se encontró el registro "${urlState.id}".` : `The requested property record ID "${urlState.id}" was not found.`,
              'error'
            );
          }
        } else if (urlState.tab === 'carriers') {
          const exists = carrier.records.some((r) => r.id === urlState.id);
          carrier.setSelectedId(urlState.id);
          if (!exists && carrier.records.length > 0) {
            mortgage.addToast(
              isSpanish ? 'Aseguradora No Encontrada' : 'Carrier Not Found',
              isSpanish ? `No se encontró la aseguradora "${urlState.id}".` : `The requested carrier record ID "${urlState.id}" was not found.`,
              'error'
            );
          }
        } else {
          const exists = mortgage.records.some((r) => getRecordId(r) === urlState.id);
          mortgage.setSelectedId(urlState.id);
          if (!exists && mortgage.records.length > 0) {
            mortgage.addToast(
              isSpanish ? 'Prestamista No Encontrado' : 'Mortgagee Record Not Found',
              isSpanish ? `No se encontró el acreedor "${urlState.id}".` : `The requested mortgagee record ID "${urlState.id}" was not found.`,
              'error'
            );
          }
        }
      }
      if (urlState.view === 'detail' && urlState.id) {
        setIsQuickViewOpen(true);
      } else {
        setIsQuickViewOpen(false);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize URL hash when tab, selected record ID, modal state, or search changes
  useEffect(() => {
    const activeId =
      activeTab === 'mortgages'
        ? mortgage.selectedId
        : activeTab === 'property'
        ? permit.selectedId
        : activeTab === 'carriers'
        ? carrier.selectedId
        : undefined;

    const currentQ =
      activeTab === 'mortgages'
        ? mortgage.searchQuery
        : activeTab === 'property'
        ? permit.searchQuery
        : activeTab === 'carriers'
        ? carrier.searchQuery
        : undefined;

    syncUrlHash({
      tab: activeTab,
      id: activeId || undefined,
      view: isQuickViewOpen && activeId ? 'detail' : undefined,
      q: currentQ || undefined,
      lang: language
    });
  }, [
    activeTab,
    isQuickViewOpen,
    mortgage.selectedId,
    permit.selectedId,
    carrier.selectedId,
    mortgage.searchQuery,
    permit.searchQuery,
    carrier.searchQuery,
    language
  ]);

  // Global close all modals helper
  const handleCloseAllModals = () => {
    setIsLoginModalOpen(false);
    setIsMortgageFormOpen(false);
    setIsMortgageDuplicate(false);
    setIsMortgageImportOpen(false);
    setIsPermitFormOpen(false);
    setIsPermitDuplicate(false);
    setIsPermitImportOpen(false);
    setIsCarrierFormOpen(false);
    setIsCarrierDuplicate(false);
    setIsBulkLinkOpen(false);
    setIsShortcutsOpen(false);
    setIsQuickViewOpen(false);
    setIsEmailModalOpen(false);
    setEmailModalRecord(null);
    setIsFeedbackModalOpen(false);
    setDeleteMortgageTargetId(null);
    setDeletePermitTargetId(null);
  };

  const isAnyModalOpen =
    isLoginModalOpen ||
    isMortgageFormOpen ||
    isMortgageImportOpen ||
    isPermitFormOpen ||
    isPermitImportOpen ||
    isCarrierFormOpen ||
    isBulkLinkOpen ||
    isShortcutsOpen ||
    isQuickViewOpen ||
    isEmailModalOpen ||
    isFeedbackModalOpen ||
    Boolean(deleteMortgageTargetId || deletePermitTargetId);

  // List navigation handler for ArrowUp/Down / j/k keys
  const handleNavigateList = (direction: 'next' | 'prev') => {
    if (activeTab === 'mortgages') {
      const records = mortgage.filteredRecords;
      if (records.length === 0) return;
      const currentIndex = records.findIndex((r) => getRecordId(r) === mortgage.selectedId);
      let nextIndex = 0;
      if (currentIndex !== -1) {
        if (direction === 'next') {
          nextIndex = Math.min(currentIndex + 1, records.length - 1);
        } else {
          nextIndex = Math.max(currentIndex - 1, 0);
        }
      }
      const targetRecord = records[nextIndex];
      if (targetRecord) {
        mortgage.setSelectedId(getRecordId(targetRecord));
      }
    } else if (activeTab === 'property') {
      const records = permit.paginatedRecords;
      if (records.length === 0) return;
      const currentIndex = records.findIndex((r) => getPermitRecordId(r) === permit.selectedId);
      let nextIndex = 0;
      if (currentIndex !== -1) {
        if (direction === 'next') {
          nextIndex = Math.min(currentIndex + 1, records.length - 1);
        } else {
          nextIndex = Math.max(currentIndex - 1, 0);
        }
      }
      const targetRecord = records[nextIndex];
      if (targetRecord) {
        permit.setSelectedId(getPermitRecordId(targetRecord));
      }
    } else if (activeTab === 'carriers') {
      const records = carrier.filteredRecords;
      if (records.length === 0) return;
      const currentIndex = records.findIndex((r) => r.id === carrier.selectedId);
      let nextIndex = 0;
      if (currentIndex !== -1) {
        if (direction === 'next') {
          nextIndex = Math.min(currentIndex + 1, records.length - 1);
        } else {
          nextIndex = Math.max(currentIndex - 1, 0);
        }
      }
      const targetRecord = records[nextIndex];
      if (targetRecord) {
        carrier.setSelectedId(targetRecord.id);
      }
    }
  };

  // Quick Copy Handler for Alt+C shortcut
  const handleQuickCopyCurrent = () => {
    if (activeTab === 'mortgages' && mortgage.selectedRecord) {
      const clause = buildMortgageeClause(mortgage.selectedRecord);
      navigator.clipboard.writeText(clause);
      mortgage.addToast(
        isSpanish ? 'Cláusula Copiada' : 'Mortgagee Clause Copied',
        mortgage.selectedRecord.Name || 'Lender Clause',
        'success'
      );
    } else if (activeTab === 'property' && permit.selectedRecord) {
      const rec = permit.selectedRecord;
      const summary = `${rec.City}, FL ${formatZipCode(rec.zip)} (${rec.County} County) | Appraiser: ${rec.PAlink || 'N/A'}`;
      navigator.clipboard.writeText(summary);
      mortgage.addToast(
        isSpanish ? 'Registro de Jurisdicción Copiado' : 'Jurisdiction Record Copied',
        summary,
        'success'
      );
    } else if (activeTab === 'carriers' && carrier.selectedRecord) {
      const rec = carrier.selectedRecord;
      const summary = `${rec.Carrier} | Pay: ${rec.Payments || 'N/A'} | Service: ${rec.CustomerServicePhone || 'N/A'} | CC Fee: ${rec.CC_Fee || 'N/A'}`;
      navigator.clipboard.writeText(summary);
      mortgage.addToast(
        isSpanish ? 'Aseguradora Copiada' : 'Carrier Summary Copied',
        summary,
        'success'
      );
    }
  };

  // Tab switching with smooth cleanup
  const handleTabChange = (newTab: DirectoryMode) => {
    setActiveTab(newTab);
    handleCloseAllModals();
  };

  // 1-Click Share Button Handler (Copies shareable URL with encoded tab and selected record ID)
  const handleShare = useCallback(() => {
    const activeId = isQuickViewOpen
      ? activeTab === 'mortgages'
        ? mortgage.selectedId
        : activeTab === 'property'
        ? permit.selectedId
        : activeTab === 'carriers'
        ? carrier.selectedId
        : undefined
      : undefined;
    const currentQ =
      activeTab === 'mortgages'
        ? mortgage.searchQuery || undefined
        : activeTab === 'property'
        ? permit.searchQuery || undefined
        : activeTab === 'carriers'
        ? carrier.searchQuery || undefined
        : undefined;
    const shareUrl = getShareableUrl({
      tab: activeTab,
      id: activeId,
      view: isQuickViewOpen && activeId ? 'detail' : undefined,
      q: currentQ,
      lang: language
    });

    navigator.clipboard.writeText(shareUrl).then(() => {
      mortgage.addToast(
        t('linkCopiedTitle'),
        t('linkCopiedDesc'),
        'success'
      );
    }).catch(() => {
      mortgage.addToast(
        'Share Link',
        shareUrl,
        'info'
      );
    });
  }, [
    activeTab,
    isQuickViewOpen,
    mortgage.selectedId,
    permit.selectedId,
    carrier.selectedId,
    mortgage.searchQuery,
    permit.searchQuery,
    carrier.searchQuery,
    language,
    t,
    mortgage.addToast
  ]);

  // Admin Authentication Handlers
  const handleAdminSuccess = () => {
    setIsAdmin(true);
    try {
      sessionStorage.setItem('agency_admin_session', 'true');
    } catch {
      // ignore
    }
    mortgage.addToast(
      isSpanish ? 'Modo Administrador Habilitado' : 'Admin Mode Activated',
      isSpanish ? 'Gestión y edición de registros desbloqueadas' : 'Record editing, creation, and batch updates enabled.',
      'success'
    );
  };

  const handleExitAdmin = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('agency_admin_session');
    } catch {
      // ignore
    }
    mortgage.addToast(
      isSpanish ? 'Modo Administrador Desactivado' : 'Exited Admin Mode',
      isSpanish ? 'Cambiado a modo de solo lectura pública' : 'Switched to Public Read-Only Search Directory',
      'info'
    );
  };

  const handleDownloadWordPressHtml = async () => {
    try {
      let response = await fetch('./standalone_index.html');
      if (!response.ok) {
        response = await fetch('./agency_directory_wordpress.html');
      }
      if (!response.ok) throw new Error('Export file not found');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      mortgage.addToast('Download Started', 'Standalone index.html downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      mortgage.addToast('Export Error', 'Failed to download standalone export file.', 'error');
    }
  };

  // --- Handlers for Mortgage Directory ---
  const handleSelectMortgageRecord = (id: string) => {
    mortgage.setSelectedId(id);
    setIsQuickViewOpen(true);
  };

  const handleOpenEmailModal = (record: MortgageRecord) => {
    setEmailModalRecord(record);
    setIsEmailModalOpen(true);
  };

  // Cross-Tab Smart Search & Auto-Routing Handlers
  const handleDetectZipInMortgageSearch = useCallback((zip: string) => {
    setActiveTab('property');
    permit.setSearchQuery(zip);
    mortgage.setSearchQuery('');
    mortgage.addToast(
      isSpanish ? 'Código Postal Detectado' : 'Detected ZIP code — redirected to FL Property Records',
      isSpanish
        ? `Detectado código postal ${zip} — redirigido a Registros de Propiedad de Florida`
        : `Detected ZIP code ${zip} — automatically loaded FL Property Records jurisdiction`,
      'info'
    );
  }, [permit, mortgage, isSpanish]);

  const handleDetectLenderInPermitSearch = useCallback((query: string) => {
    setActiveTab('mortgages');
    mortgage.setSearchQuery(query);
    permit.setSearchQuery('');
    mortgage.addToast(
      isSpanish ? 'Prestamista Detectado' : 'Detected lender name — redirected to Mortgagee Clause Directory',
      isSpanish
        ? `Detectado prestamista "${query}" — redirigido al Directorio de Cláusulas Hipotecarias`
        : `Detected lender term "${query}" — automatically searched Mortgagee Clause Directory`,
      'info'
    );
  }, [mortgage, permit, isSpanish]);

  const handleAddNewMortgage = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsMortgageDuplicate(false);
    setEditingMortgageRecord(null);
    setIsMortgageFormOpen(true);
  };

  const handleEditMortgageRecord = (rec: MortgageRecord) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsMortgageDuplicate(false);
    setEditingMortgageRecord(rec);
    setIsMortgageFormOpen(true);
  };

  const handleDuplicateMortgageRecord = (rec: MortgageRecord) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsMortgageDuplicate(true);
    setEditingMortgageRecord(rec);
    setIsMortgageFormOpen(true);
  };

  const handleDeleteMortgageTrigger = (id: string) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setDeleteMortgageTargetId(id);
  };

  const handleMortgageFormSubmit = (data: Omit<MortgageRecord, '_id' | 'LastUpdated'>) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isMortgageDuplicate || !editingMortgageRecord) {
      const newId = mortgage.createRecord(data);
      mortgage.setSelectedId(newId);
      setIsQuickViewOpen(true);
      mortgage.addToast(
        isMortgageDuplicate ? 'Mortgagee Record Duplicated & Saved' : 'Mortgagee Record Added',
        `${data.Name} saved as a new record.`,
        'success'
      );
    } else {
      mortgage.updateRecord(getRecordId(editingMortgageRecord), data);
      mortgage.addToast(
        'Mortgagee Record Updated',
        `${data.Name} updated successfully.`,
        'success'
      );
    }
    setIsMortgageDuplicate(false);
    setIsMortgageFormOpen(false);
  };

  // --- Handlers for Property & Permit Directory ---
  const handleSelectPermitRecord = (id: string) => {
    permit.setSelectedId(id);
    setIsQuickViewOpen(true);
  };

  const handleAddNewPermit = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsPermitDuplicate(false);
    setEditingPermitRecord(null);
    setIsPermitFormOpen(true);
  };

  const handleEditPermitRecord = (rec: FloridaZipRecord) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsPermitDuplicate(false);
    setEditingPermitRecord(rec);
    setIsPermitFormOpen(true);
  };

  const handleDuplicatePermitRecord = (rec: FloridaZipRecord) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsPermitDuplicate(true);
    setEditingPermitRecord(rec);
    setIsPermitFormOpen(true);
  };

  const handleDeletePermitTrigger = (id: string) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setDeletePermitTargetId(id);
  };

  const handlePermitFormSave = (recordData: Omit<FloridaZipRecord, '_id'>) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isPermitDuplicate || !editingPermitRecord) {
      const newId = permit.createRecord(recordData);
      permit.setSelectedId(newId);
      setIsQuickViewOpen(true);
      mortgage.addToast(
        isPermitDuplicate ? 'Jurisdiction Duplicated & Saved' : 'Jurisdiction Added',
        `${recordData.City}, FL ${recordData.zip} (${recordData.County} County) saved as a new record.`,
        'success'
      );
    } else {
      permit.updateRecord(getPermitRecordId(editingPermitRecord), recordData);
      mortgage.addToast(
        'Jurisdiction Record Updated',
        `${recordData.City}, FL ${recordData.zip} updated successfully.`,
        'success'
      );
    }
    setIsPermitDuplicate(false);
    setIsPermitFormOpen(false);
  };

  // --- Handlers for Insurance Carriers Directory ---
  const handleSelectCarrierRecord = (id: string) => {
    carrier.setSelectedId(id);
    setIsQuickViewOpen(true);
  };

  const handleAddNewCarrier = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsCarrierDuplicate(false);
    setEditingCarrierRecord(null);
    setIsCarrierFormOpen(true);
  };

  const handleEditCarrierRecord = (rec: CarrierRecord) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsCarrierDuplicate(false);
    setEditingCarrierRecord(rec);
    setIsCarrierFormOpen(true);
  };

  const handleDuplicateCarrierRecord = (rec: CarrierRecord) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsCarrierDuplicate(true);
    setEditingCarrierRecord(rec);
    setIsCarrierFormOpen(true);
  };

  const handleCarrierFormSave = (data: Omit<CarrierRecord, 'id' | 'LastUpdated'>) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isCarrierDuplicate || !editingCarrierRecord) {
      const newId = carrier.createRecord(data);
      carrier.setSelectedId(newId);
      setIsQuickViewOpen(true);
      mortgage.addToast(
        isCarrierDuplicate ? 'Carrier Duplicated & Saved' : 'Carrier Record Added',
        `${data.Carrier} saved to Insurance Carriers directory.`,
        'success'
      );
    } else {
      carrier.updateRecord(editingCarrierRecord.id, data);
      mortgage.addToast(
        'Carrier Record Updated',
        `${data.Carrier} updated successfully.`,
        'success'
      );
    }
    setIsCarrierDuplicate(false);
    setIsCarrierFormOpen(false);
  };

  const handleOpenBulkUpdate = (
    scope: BulkScopeMode = 'city',
    initialCity: string = '',
    initialCounty: string = ''
  ) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setBulkInitialScope(scope);
    setBulkInitialCity(initialCity);
    setBulkInitialCounty(initialCounty);
    setIsBulkLinkOpen(true);
  };

  const handleApplyBulkLinks = (options: BulkUpdateLinksOptions) => {
    if (!isAdmin) return;
    permit.bulkUpdateLinks(options);
    setIsBulkLinkOpen(false);
  };

  // Header quick dispatchers based on active tab
  const handleHeaderAddNew = () => {
    if (activeTab === 'property') {
      handleAddNewPermit();
    } else if (activeTab === 'carriers') {
      handleAddNewCarrier();
    } else {
      handleAddNewMortgage();
    }
  };

  const handleHeaderOpenImport = () => {
    if (activeTab === 'property') {
      setIsPermitImportOpen(true);
    } else {
      setIsMortgageImportOpen(true);
    }
  };

  const handleHeaderExport = (format: 'json' | 'csv') => {
    if (activeTab === 'property') {
      permit.exportData(format);
    } else if (activeTab === 'carriers') {
      carrier.exportData(format);
    } else {
      mortgage.exportData(format);
    }
  };

  // Keyboard Shortcuts Hook
  useGlobalShortcuts({
    directoryMode: activeTab,
    onDirectoryModeChange: handleTabChange,
    isAnyModalOpen,
    onCloseAllModals: handleCloseAllModals,
    isAdmin,
    onOpenAddNew: handleHeaderAddNew,
    onOpenAdminLogin: () => setIsLoginModalOpen(true),
    onOpenShortcuts: () => setIsShortcutsOpen(true),
    onExport: handleHeaderExport,
    mobileShowDetail: false,
    onCloseMobileDetail: () => {},
    onNavigateList: handleNavigateList,
    enabled: enableShortcuts
  });

  // QuickView Next & Prev handlers for seamless modal pagination
  const currentMortgageIndex = mortgage.filteredRecords.findIndex(
    (r) => getRecordId(r) === mortgage.selectedId
  );
  const hasPrevMortgage = currentMortgageIndex > 0;
  const hasNextMortgage =
    currentMortgageIndex !== -1 && currentMortgageIndex < mortgage.filteredRecords.length - 1;

  const currentPermitIndex = permit.paginatedRecords.findIndex(
    (r) => getPermitRecordId(r) === permit.selectedId
  );
  const hasPrevPermit = currentPermitIndex > 0;
  const hasNextPermit =
    currentPermitIndex !== -1 && currentPermitIndex < permit.paginatedRecords.length - 1;

  const currentCarrierIndex = carrier.filteredRecords.findIndex(
    (r) => r.id === carrier.selectedId
  );
  const hasPrevCarrier = currentCarrierIndex > 0;
  const hasNextCarrier =
    currentCarrierIndex !== -1 && currentCarrierIndex < carrier.filteredRecords.length - 1;

  const activeTotalCount =
    activeTab === 'property'
      ? permit.stats.total
      : activeTab === 'carriers'
      ? carrier.stats.total
      : mortgage.stats.total;

  const activeFilteredCount =
    activeTab === 'property'
      ? permit.stats.filteredCount
      : activeTab === 'carriers'
      ? carrier.stats.filteredCount
      : mortgage.stats.filteredCount;

  const fontScaleClass =
    fontSize === 'xl'
      ? 'text-[14.5px]'
      : fontSize === 'large'
      ? 'text-[13.5px]'
      : 'text-[12.5px]';

  return (
    <div className={`min-h-screen bg-[#f4f5f7] flex flex-col font-sans antialiased text-[#222] ${fontScaleClass}`}>
      {/* 1. Universal Enterprise Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        totalCount={activeTotalCount}
        filteredCount={activeFilteredCount}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onExitAdmin={handleExitAdmin}
        onOpenFeedback={() => handleOpenFeedback()}
        onShare={handleShare}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onAddNew={isAdmin ? handleHeaderAddNew : undefined}
        onOpenImport={isAdmin ? handleHeaderOpenImport : undefined}
        onOpenBulkUpdate={isAdmin ? () => handleOpenBulkUpdate('city') : undefined}
        onExport={isAdmin ? handleHeaderExport : undefined}
        onDownloadWordPressHtml={isAdmin ? handleDownloadWordPressHtml : undefined}
      />

      {/* 2. Persistent View Settings & Display Toolbar (Second Bar) */}
      <ViewSettingsBar
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        totalCount={activeTotalCount}
        filteredCount={activeFilteredCount}
      />

      {/* Admin Mode Active Banner Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-neutral-950 px-4 py-1.5 border-b border-amber-600/80 shadow-xs flex items-center justify-between gap-3 text-[12px] font-semibold">
          <div className="flex items-center gap-2 max-w-[1850px] mx-auto w-full justify-between flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-950" />
              <span>
                {isSpanish
                  ? 'Modo Administrador Activo — Edición, duplicación, adiciones y gestión habilitadas'
                  : 'Admin Mode Active — Record Editing, Duplication, Additions & Database Management Enabled'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddNewMortgage}
                className="app-btn bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-950 font-bold text-[11px] py-[2px] px-2.5 flex items-center gap-1 cursor-pointer border border-neutral-950/30 rounded-[2px]"
                title="Add a new blank mortgagee record"
              >
                <Building2 className="w-3 h-3 text-neutral-950" />
                <span>+ Add Mortgagee</span>
              </button>
              <button
                type="button"
                onClick={handleAddNewPermit}
                className="app-btn bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-950 font-bold text-[11px] py-[2px] px-2.5 flex items-center gap-1 cursor-pointer border border-neutral-950/30 rounded-[2px]"
                title="Add a new blank jurisdiction record"
              >
                <MapPin className="w-3 h-3 text-neutral-950" />
                <span>+ Add Jurisdiction</span>
              </button>
              <button
                type="button"
                onClick={handleAddNewCarrier}
                className="app-btn bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-950 font-bold text-[11px] py-[2px] px-2.5 flex items-center gap-1 cursor-pointer border border-neutral-950/30 rounded-[2px]"
                title="Add a new insurance carrier record"
              >
                <Shield className="w-3 h-3 text-neutral-950" />
                <span>+ Add Carrier</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenBulkUpdate('city')}
                className="app-btn bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-950 font-bold text-[11px] py-[2px] px-2.5 flex items-center gap-1 cursor-pointer border border-neutral-950/30 rounded-[2px]"
                title="Bulk update links for counties, cities, or custom groups"
              >
                <LinkIcon className="w-3 h-3 text-neutral-950" />
                <span>{isSpanish ? 'Enlazar por Lotes' : 'Bulk Update Links'}</span>
              </button>
              <button
                onClick={handleExitAdmin}
                className="app-btn bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] py-[2px] px-2.5 flex items-center gap-1 cursor-pointer border border-neutral-950"
              >
                <LogOut className="w-3 h-3" />
                <span>{t('adminLogout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Body Canvas */}
      <main className="flex-1 max-w-[1850px] w-full mx-auto p-2.5 sm:p-4 flex flex-col">
        {activeTab === 'disclaimer' ? (
          /* View 3: Dedicated Disclaimer View */
          <DisclaimerView
            onBackToMortgages={() => handleTabChange('mortgages')}
            onBackToProperty={() => handleTabChange('property')}
          />
        ) : activeTab === 'mortgages' ? (
          /* View 1: Mortgages / Loss Payee Directory */
          <>
            <h1 className="sr-only">
              Mortgagee Clause Directory and Insurance Tracking Loss Payee Lookup
            </h1>

            {/* Search & Filter Bar (Clean search, preset chips, separate sort) */}
            <SearchFilterBar
              searchQuery={mortgage.searchQuery}
              onSearchChange={mortgage.setSearchQuery}
              categoryFilter={mortgage.categoryFilter}
              onCategoryChange={mortgage.setCategoryFilter}
              sortOption={mortgage.sortOption}
              onSortChange={mortgage.setSortOption}
              stats={mortgage.stats}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onDetectZip={handleDetectZipInMortgageSearch}
            />

            {/* Full-Width Master Data Grid Table */}
            <div className="flex-1 w-full pb-6">
              <MortgageList
                records={mortgage.filteredRecords}
                selectedId={mortgage.selectedId}
                onSelect={handleSelectMortgageRecord}
                searchQuery={mortgage.searchQuery}
                isAdmin={isAdmin}
                onEdit={handleEditMortgageRecord}
                onDuplicate={handleDuplicateMortgageRecord}
                onDelete={handleDeleteMortgageTrigger}
                onEmailDocs={handleOpenEmailModal}
                onSuggestCorrection={(rec) =>
                  handleOpenFeedback(
                    'correct_mortgage',
                    rec.Name || '',
                    buildMortgageeClause(rec),
                    getRecordId(rec)
                  )
                }
                onQuickCopy={(clause) =>
                  mortgage.addToast(
                    isSpanish ? 'Cláusula Hipotecaria Copiada' : 'Mortgagee Clause Copied',
                    clause.split('\n')[0],
                    'success'
                  )
                }
              />
            </div>
          </>
        ) : activeTab === 'carriers' ? (
          /* View 3: Insurance Carriers Directory */
          <>
            <h1 className="sr-only">
              Insurance Carriers Directory — Payments, Agent Portals, Claims & Customer Service
            </h1>

            <CarrierFilterBar
              searchQuery={carrier.searchQuery}
              onSearchChange={carrier.setSearchQuery}
              lobFilter={carrier.lobFilter}
              onLobChange={carrier.setLobFilter}
              citizensTakeoutOnly={carrier.citizensTakeoutOnly}
              onToggleCitizensTakeout={() =>
                carrier.setCitizensTakeoutOnly((prev) => !prev)
              }
              noCcFeeOnly={carrier.noCcFeeOnly}
              onToggleNoCcFee={() => carrier.setNoCcFeeOnly((prev) => !prev)}
              sortOption={carrier.sortOption}
              onSortChange={carrier.setSortOption}
              stats={carrier.stats}
              onResetFilters={carrier.resetFilters}
              onAddNewCarrier={isAdmin ? handleAddNewCarrier : undefined}
            />

            <div className="flex-1 w-full pb-6">
              <CarrierList
                records={carrier.filteredRecords}
                selectedId={carrier.selectedId}
                onSelect={handleSelectCarrierRecord}
                searchQuery={carrier.searchQuery}
                isAdmin={isAdmin}
                onEdit={handleEditCarrierRecord}
                onDuplicate={handleDuplicateCarrierRecord}
                onDelete={(id) => carrier.deleteRecord(id)}
                onToast={mortgage.addToast}
              />
            </div>
          </>
        ) : (
          /* View 2: Florida Property Appraisers, Municipal Permits & Wind Hazards */
          <>
            <h1 className="sr-only">
              Florida Municipal Building Permits, Property Appraisers & Wind Hazard Directory
            </h1>

            {/* Florida Search & Multi-Filter Bar */}
            <PermitFilterBar
              searchQuery={permit.searchQuery}
              onSearchChange={permit.setSearchQuery}
              countyFilter={permit.countyFilter}
              onCountyChange={permit.setCountyFilter}
              cityFilter={permit.cityFilter}
              onCityChange={permit.setCityFilter}
              availableCities={permit.availableCities}
              uniqueCounties={permit.uniqueCounties}
              terrainFilter={permit.terrainFilter}
              onTerrainChange={permit.setTerrainFilter}
              sortOption={permit.sortOption}
              onSortChange={permit.setSortOption}
              hasCityPermitOnly={permit.hasCityPermitOnly}
              onToggleHasCityPermit={() => permit.setHasCityPermitOnly((prev) => !prev)}
              hasCountyPermitOnly={permit.hasCountyPermitOnly}
              onToggleHasCountyPermit={() => permit.setHasCountyPermitOnly((prev) => !prev)}
              stats={permit.stats}
              onDetectLender={handleDetectLenderInPermitSearch}
              onAddNewJurisdiction={isAdmin ? handleAddNewPermit : undefined}
              onOpenImport={isAdmin ? () => setIsPermitImportOpen(true) : undefined}
              onOpenBulkUpdate={isAdmin ? () => handleOpenBulkUpdate('city') : undefined}
            />

            {/* Master Data Grid Table for Florida Jurisdictions */}
            <div className="flex-1 w-full pb-6">
              <PermitList
                records={permit.paginatedRecords}
                allFilteredCount={permit.stats.filteredCount}
                selectedId={permit.selectedId}
                onSelect={handleSelectPermitRecord}
                searchQuery={permit.searchQuery}
                isAdmin={isAdmin}
                onEdit={handleEditPermitRecord}
                onDuplicate={handleDuplicatePermitRecord}
                onDelete={handleDeletePermitTrigger}
                onQuickCopy={(formattedText) =>
                  mortgage.addToast(
                    isSpanish ? 'Enlace Copiado' : 'Link Copied',
                    formattedText,
                    'success'
                  )
                }
                pageSize={permit.pageSize}
                onPageSizeChange={permit.setPageSize}
                currentPage={permit.currentPage}
                onPageChange={permit.setCurrentPage}
                totalPages={permit.totalPages}
                countyFilter={permit.countyFilter}
                onCountyChange={permit.setCountyFilter}
              />
            </div>
          </>
        )}
      </main>

      {/* --- In-Page QuickView Modal --- */}
      {activeTab === 'mortgages' && (
        <QuickViewModal
          isOpen={isQuickViewOpen && Boolean(mortgage.selectedRecord)}
          onClose={() => setIsQuickViewOpen(false)}
          title={mortgage.selectedRecord?.Name || 'Mortgagee Account Details'}
          subtitle={
            mortgage.selectedRecord
              ? [mortgage.selectedRecord.Address, mortgage.selectedRecord.City, mortgage.selectedRecord.State, mortgage.selectedRecord.ZIP]
                  .filter(Boolean)
                  .join(', ')
              : undefined
          }
          badge={
            mortgage.selectedRecord ? (
              isLossPayee(mortgage.selectedRecord) ? (
                <span className="text-[10px] bg-rose-500/30 text-rose-200 border border-rose-400/40 px-2 py-0.5 rounded font-bold font-sans">
                  {isSpanish ? 'Beneficiario de Pérdida' : 'Loss Payee / Both'}
                </span>
              ) : (
                <span className="text-[10px] bg-sky-500/30 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded font-semibold font-sans">
                  {isSpanish ? 'Acreedor Hipotecario' : 'Mortgagee'}
                </span>
              )
            ) : null
          }
          icon={<Building2 className="w-4 h-4" />}
          hasPrev={hasPrevMortgage}
          hasNext={hasNextMortgage}
          currentIndex={currentMortgageIndex}
          totalCount={mortgage.filteredRecords.length}
          onPrev={() => {
            if (hasPrevMortgage) {
              const prevRec = mortgage.filteredRecords[currentMortgageIndex - 1];
              if (prevRec) mortgage.setSelectedId(getRecordId(prevRec));
            }
          }}
          onNext={() => {
            if (hasNextMortgage) {
              const nextRec = mortgage.filteredRecords[currentMortgageIndex + 1];
              if (nextRec) mortgage.setSelectedId(getRecordId(nextRec));
            }
          }}
        >
          {mortgage.selectedRecord && (
            <MortgageDetail
              record={mortgage.selectedRecord}
              isAdmin={isAdmin}
              onEdit={(rec) => {
                setIsQuickViewOpen(false);
                handleEditMortgageRecord(rec);
              }}
              onDuplicate={(rec) => {
                setIsQuickViewOpen(false);
                handleDuplicateMortgageRecord(rec);
              }}
              onDelete={(id) => {
                setIsQuickViewOpen(false);
                handleDeleteMortgageTrigger(id);
              }}
              onEmailDocs={handleOpenEmailModal}
              onSuggestCorrection={(rec) => {
                setIsQuickViewOpen(false);
                handleOpenFeedback(
                  'correct_mortgage',
                  rec.Name || '',
                  `Email: ${rec.email || ''}\nPhone: ${rec.Telephone || ''}\nFAX: ${rec.FAX || ''}\nPortal: ${rec.Online || ''}`
                );
              }}
              onToast={mortgage.addToast}
            />
          )}
        </QuickViewModal>
      )}

      {activeTab === 'property' && (
        <QuickViewModal
          isOpen={isQuickViewOpen && Boolean(permit.selectedRecord)}
          onClose={() => setIsQuickViewOpen(false)}
          title={
            permit.selectedRecord
              ? `${permit.selectedRecord.City}, FL ${formatZipCode(permit.selectedRecord.zip)}`
              : 'Florida Jurisdiction Details'
          }
          subtitle={
            permit.selectedRecord
              ? `${permit.selectedRecord.County} County • Terrain ${permit.selectedRecord.Terrain || 'B'}`
              : undefined
          }
          badge={
            permit.selectedRecord?.Terrain === 'C' ? (
              <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded font-bold font-sans">
                {isSpanish ? 'Terreno C (Viento Alto)' : 'Terrain C (High Wind)'}
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded font-semibold font-sans">
                {isSpanish ? 'Terreno B (Interior)' : 'Terrain B (Inland)'}
              </span>
            )
          }
          icon={<MapPin className="w-4 h-4" />}
          hasPrev={hasPrevPermit}
          hasNext={hasNextPermit}
          currentIndex={currentPermitIndex}
          totalCount={permit.paginatedRecords.length}
          onPrev={() => {
            if (hasPrevPermit) {
              const prevRec = permit.paginatedRecords[currentPermitIndex - 1];
              if (prevRec) permit.setSelectedId(getPermitRecordId(prevRec));
            }
          }}
          onNext={() => {
            if (hasNextPermit) {
              const nextRec = permit.paginatedRecords[currentPermitIndex + 1];
              if (nextRec) permit.setSelectedId(getPermitRecordId(nextRec));
            }
          }}
        >
          {permit.selectedRecord && (
            <PermitDetail
              record={permit.selectedRecord}
              isAdmin={isAdmin}
              onEdit={(rec) => {
                setIsQuickViewOpen(false);
                handleEditPermitRecord(rec);
              }}
              onDuplicate={(rec) => {
                setIsQuickViewOpen(false);
                handleDuplicatePermitRecord(rec);
              }}
              onDelete={(id) => {
                setIsQuickViewOpen(false);
                handleDeletePermitTrigger(id);
              }}
              onOpenBulkUpdate={(scope, city, county) => {
                setIsQuickViewOpen(false);
                handleOpenBulkUpdate(scope, city, county);
              }}
              onSuggestCorrection={(rec) => {
                setIsQuickViewOpen(false);
                handleOpenFeedback(
                  'correct_permit',
                  `${rec.City}, FL ${formatZipCode(rec.zip)} (${rec.County} County)`,
                  `Property Appraiser: ${rec.PAlink || ''}\nPermit City: ${rec.PermitByCity || ''}\nPermit County: ${rec.PermitByCounty || ''}\nWind Terrain: ${rec.Terrain || ''}`
                );
              }}
              onToast={mortgage.addToast}
            />
          )}
        </QuickViewModal>
      )}

      {activeTab === 'carriers' && (
        <CarrierDetailModal
          isOpen={isQuickViewOpen && Boolean(carrier.selectedRecord)}
          onClose={() => setIsQuickViewOpen(false)}
          record={carrier.selectedRecord}
          isAdmin={isAdmin}
          onEdit={(rec) => {
            setIsQuickViewOpen(false);
            handleEditCarrierRecord(rec);
          }}
          onDuplicate={(rec) => {
            setIsQuickViewOpen(false);
            handleDuplicateCarrierRecord(rec);
          }}
          onDelete={(id) => {
            setIsQuickViewOpen(false);
            carrier.deleteRecord(id);
          }}
          onSuggestCorrection={(rec) => {
            setIsQuickViewOpen(false);
            handleOpenFeedback(
              'correct_mortgage',
              `Carrier: ${rec.Carrier}`,
              `Payments: ${rec.Payments || ''}\nAgent Portal: ${rec.AgentPortalLogin || ''}\nService Phone: ${rec.CustomerServicePhone || ''}\nClaims Phone: ${rec.ClaimsPhone || ''}\nCC Fee: ${rec.CC_Fee || ''}`
            );
          }}
          onToast={mortgage.addToast}
          hasPrev={hasPrevCarrier}
          hasNext={hasNextCarrier}
          currentIndex={currentCarrierIndex}
          totalCount={carrier.filteredRecords.length}
          onPrev={() => {
            if (hasPrevCarrier) {
              const prevRec = carrier.filteredRecords[currentCarrierIndex - 1];
              if (prevRec) carrier.setSelectedId(prevRec.id);
            }
          }}
          onNext={() => {
            if (hasNextCarrier) {
              const nextRec = carrier.filteredRecords[currentCarrierIndex + 1];
              if (nextRec) carrier.setSelectedId(nextRec.id);
            }
          }}
        />
      )}

      {/* --- Management Modals (Admin & User) --- */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <MortgageFormModal
        isOpen={isMortgageFormOpen}
        onClose={() => setIsMortgageFormOpen(false)}
        initialData={editingMortgageRecord}
        isDuplicate={isMortgageDuplicate}
        onSubmit={handleMortgageFormSubmit}
      />

      <PermitFormModal
        isOpen={isPermitFormOpen}
        onClose={() => setIsPermitFormOpen(false)}
        editingRecord={editingPermitRecord}
        isDuplicate={isPermitDuplicate}
        onSave={handlePermitFormSave}
      />

      <CarrierFormModal
        isOpen={isCarrierFormOpen}
        onClose={() => setIsCarrierFormOpen(false)}
        editingRecord={editingCarrierRecord}
        isDuplicate={isCarrierDuplicate}
        onSave={handleCarrierFormSave}
      />

      <ImportModal
        isOpen={isMortgageImportOpen}
        onClose={() => setIsMortgageImportOpen(false)}
        onImport={(records, mode) => {
          mortgage.importRecords(records, mode);
          mortgage.addToast(
            'Import Successful',
            `Imported ${records.length.toLocaleString()} mortgage clauses into directory`,
            'success'
          );
        }}
      />

      <PermitImportModal
        isOpen={isPermitImportOpen}
        onClose={() => setIsPermitImportOpen(false)}
        onImport={(records, mode) => {
          permit.importRecords(records, mode);
          mortgage.addToast(
            'Import Successful',
            `Imported ${records.length.toLocaleString()} Florida jurisdiction records`,
            'success'
          );
        }}
      />

      <BulkLinkModal
        isOpen={isBulkLinkOpen}
        onClose={() => setIsBulkLinkOpen(false)}
        allRecords={permit.records}
        filteredRecords={permit.paginatedRecords}
        uniqueCounties={permit.uniqueCounties}
        allCities={permit.availableCities}
        initialScope={bulkInitialScope}
        initialCity={bulkInitialCity}
        initialCounty={bulkInitialCounty}
        onApplyBulkUpdate={handleApplyBulkLinks}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteMortgageTargetId || deletePermitTargetId)}
        onClose={() => {
          setDeleteMortgageTargetId(null);
          setDeletePermitTargetId(null);
        }}
        onConfirm={() => {
          if (deleteMortgageTargetId) {
            mortgage.deleteRecord(deleteMortgageTargetId);
            setDeleteMortgageTargetId(null);
          } else if (deletePermitTargetId) {
            permit.deleteRecord(deletePermitTargetId);
            setDeletePermitTargetId(null);
          }
        }}
        mortgageRecord={mortgage.records.find((r) => getRecordId(r) === deleteMortgageTargetId)}
        permitRecord={permit.records.find((r) => getPermitRecordId(r) === deletePermitTargetId)}
      />

      {/* Keyboard Shortcuts Reference Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Policy Documents Email Dispatcher Modal */}
      <PolicyEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailModalRecord(null);
        }}
        record={emailModalRecord}
        onToast={mortgage.addToast}
      />

      {/* Directory Information Correction & Submission Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        initialType={feedbackInitialType}
        initialEntityName={feedbackInitialEntity}
        initialRecordId={feedbackInitialRecordId}
        initialDetails={feedbackInitialDetails}
        onToast={mortgage.addToast}
      />

      {/* Desktop Notification Toasts */}
      <ToastContainer toasts={mortgage.toasts} onDismiss={mortgage.removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PreferencesProvider>
        <DirectoryApp />
      </PreferencesProvider>
    </LanguageProvider>
  );
}
