export type Language = 'en' | 'es';

export interface TranslationDict {
  // Navigation & App Header
  appTitle: string;
  appSubtitle: string;
  tabMortgages: string;
  tabPermits: string;
  tabDisclaimer: string;
  btnShare: string;
  btnShareCopied: string;
  btnShareTooltip: string;
  btnAddCorrect: string;
  btnAddCorrectTooltip: string;
  adminMode: string;
  adminLogin: string;
  adminLoginTooltip: string;
  adminLogout: string;
  totalRecords: string;
  foundRecords: string;

  // Helpful instructions & hints
  searchMortgagePlaceholder: string;
  searchPermitPlaceholder: string;
  searchHintMortgage: string;
  searchHintPermit: string;
  quickViewHint: string;
  shortcutHint: string;

  // Filters & Controls
  filterAllTypes: string;
  filterMortgageeOnly: string;
  filterLossPayeeOnly: string;
  filterVerifiedOnly: string;
  filterHasEmail: string;
  filterHasPortal: string;
  sortBy: string;
  sortNameAsc: string;
  sortNameDesc: string;
  sortCity: string;
  sortRecentlyUpdated: string;
  clearFilters: string;
  showingResults: string;
  ofRecords: string;

  // Actions & Buttons
  quickView: string;
  copyClause: string;
  clauseCopied: string;
  emailDocs: string;
  visitPortal: string;
  printSheet: string;
  suggestCorrection: string;
  editRecord: string;
  deleteRecord: string;
  addRecord: string;
  exportData: string;
  importData: string;
  bulkLinker: string;
  keyboardShortcuts: string;

  // Clause & Customizer
  clauseCardTitle: string;
  addLoanNumber: string;
  hideFields: string;
  copyFullClause: string;
  inputLoanNumber: string;
  inputBorrower: string;
  inputPolicyNumber: string;
  customizerHelperText: string;

  // Contact Channels
  contactChannelsTitle: string;
  phone: string;
  fax: string;
  email: string;
  onlinePortal: string;
  noPhone: string;
  noFax: string;
  noEmail: string;
  noPortal: string;
  internalNotes: string;

  // Policy Email Card & Modal
  emailCardTitle: string;
  emailCardSubtitle: string;
  openEmailDispatcher: string;
  copyEmailTemplate: string;
  templateCopied: string;
  sendViaMailClient: string;
  emailSubject: string;
  copySubject: string;
  copyBody: string;
  emailModalTitle: string;
  emailModalSubtitle: string;
  toRecipient: string;
  carrierName: string;
  includeFooterToggle: string;
  emailWorkflowNote: string;
  emailBodyHello: string;
  emailBodyMessage: string;
  emailBodyPayment: string;
  emailBodyConfirmation: string;

  // Florida Permits
  permitAppraiserTitle: string;
  permitMunicipalTitle: string;
  permitWindTitle: string;
  countyLabel: string;
  zipLabel: string;
  searchCountyPlaceholder: string;
  allCounties: string;
  appraiserSearchAction: string;
  permitSearchAction: string;
  taxCollectorAction: string;
  exposureCategory: string;
  jurisdictionNotes: string;

  // Feedback Modal
  feedbackTitle: string;
  feedbackSubtitle: string;
  feedbackNoticeTitle: string;
  feedbackNoticeDesc: string;
  submissionTypeLabel: string;
  entityNameLabel: string;
  fieldsBeingUpdated: string;
  newInfoLabel: string;
  sourceReferenceLabel: string;
  submitterInfoLabel: string;
  btnSendEmailAdmin: string;

  // Languages & Google Translate
  languageSwitch: string;
  english: string;
  spanish: string;
  moreLanguages: string;
  googleTranslateTitle: string;
  selectLanguage: string;
  translateDisclaimer: string;

  // Share Modal / Toasts
  linkCopiedTitle: string;
  linkCopiedDesc: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    appTitle: 'Insurance Mortgagee & Florida Permit Directory',
    appSubtitle: 'Lender Mortgagee Clauses, ISAOA/ATIMA Tracking & Florida Building Permit Departments',
    tabMortgages: 'Mortgagee Clauses',
    tabPermits: 'FL Property Records',
    tabDisclaimer: 'Legal Disclaimer',
    btnShare: 'Share',
    btnShareCopied: 'Link Copied!',
    btnShareTooltip: 'Copy direct shareable link for this view and selected record',
    btnAddCorrect: 'Add or Correct Info',
    btnAddCorrectTooltip: 'Submit new information or suggest a correction to Directory Admin',
    adminMode: 'Admin Mode',
    adminLogin: 'Admin Login',
    adminLoginTooltip: 'Administrator authentication for record updates and database operations',
    adminLogout: 'Logout Admin',
    totalRecords: 'Total',
    foundRecords: 'Found',

    searchMortgagePlaceholder: 'Search lender, ISAOA/ATIMA, address, city, state, ZIP...',
    searchPermitPlaceholder: 'Search Florida ZIP code, city, county, or municipality...',
    searchHintMortgage: 'Tip: Press Ctrl+K to search. Search by lender name, ISAOA, address, or servicing email.',
    searchHintPermit: 'Tip: Enter a 5-digit Florida ZIP code to view County Property Appraiser, Permit Office & Wind Exposure.',
    quickViewHint: 'Click any row or use arrow keys (↑ / ↓) and Enter to open QuickView.',
    shortcutHint: 'Press ? for keyboard shortcuts',

    filterAllTypes: 'All Clauses',
    filterMortgageeOnly: 'Mortgagee Only',
    filterLossPayeeOnly: 'Loss Payee / Both',
    filterVerifiedOnly: 'Has Email / Portal',
    filterHasEmail: 'Has Servicing Email',
    filterHasPortal: 'Has Online Portal',
    sortBy: 'Sort by',
    sortNameAsc: 'Name (A to Z)',
    sortNameDesc: 'Name (Z to A)',
    sortCity: 'City / Location',
    sortRecentlyUpdated: 'Recently Updated',
    clearFilters: 'Clear All Filters',
    showingResults: 'Showing',
    ofRecords: 'of',

    quickView: 'Quick View',
    copyClause: 'Copy Clause',
    clauseCopied: 'Clause Copied!',
    emailDocs: 'Email Docs',
    visitPortal: 'Online Portal',
    printSheet: 'Print Sheet',
    suggestCorrection: 'Suggest Correction',
    editRecord: 'Edit Record',
    deleteRecord: 'Delete Record',
    addRecord: 'Add Record',
    exportData: 'Export',
    importData: 'Import',
    bulkLinker: 'Batch Linker',
    keyboardShortcuts: 'Shortcuts',

    clauseCardTitle: 'Standard Mortgagee / Loss Payee Clause',
    addLoanNumber: 'Add Loan #',
    hideFields: 'Hide Fields',
    copyFullClause: 'Copy Full Clause',
    inputLoanNumber: 'Loan # / Account Number',
    inputBorrower: 'Named Insured / Borrower',
    inputPolicyNumber: 'Policy # (Optional)',
    customizerHelperText: 'Entering a Loan # or Named Insured updates the formatted clause and email template in real time.',

    contactChannelsTitle: 'Servicing & Contact Channels',
    phone: 'Phone / Toll-Free',
    fax: 'FAX Number',
    email: 'Direct Servicing Email',
    onlinePortal: 'Online Document Portal',
    noPhone: 'No phone number listed',
    noFax: 'No FAX number listed',
    noEmail: 'No email on file',
    noPortal: 'No online upload portal on file',
    internalNotes: 'Servicing Instructions & Operational Notes',

    emailCardTitle: 'Email Policy Documents & Invoice (Template)',
    emailCardSubtitle: 'Pre-formatted email for sending declarations pages and invoices to the lender',
    openEmailDispatcher: 'Email Dispatcher',
    copyEmailTemplate: 'Copy Template',
    templateCopied: 'Template Copied!',
    sendViaMailClient: 'Send via your email app',
    emailSubject: 'Subject Line',
    copySubject: 'Copy Subject',
    copyBody: 'Copy Body',
    emailModalTitle: 'Send Policy Documents to Mortgagee',
    emailModalSubtitle: 'Dec Page & Invoice Dispatcher',
    toRecipient: 'Recipient Email (To)',
    carrierName: 'Insurance Carrier Name',
    includeFooterToggle: 'Include policy summary reference footer',
    emailWorkflowNote: 'Attach your PDF declarations page and invoice in your mail client after opening.',
    emailBodyHello: 'Hello,',
    emailBodyMessage: 'Please find the attached invoice and declarations page for the loan referenced above.',
    emailBodyPayment: 'Kindly forward the payment to the carrier to ensure continuous coverage for this policyholder.',
    emailBodyConfirmation: 'Please reply with the scheduled payment date and check number once processed.',

    permitAppraiserTitle: 'County Property Appraiser & Tax Collector',
    permitMunicipalTitle: 'Municipal & County Building Permit Offices',
    permitWindTitle: 'Florida Building Code & Wind Exposure',
    countyLabel: 'County',
    zipLabel: 'ZIP Code',
    searchCountyPlaceholder: 'Search 67 Florida Counties...',
    allCounties: 'All 67 Florida Counties',
    appraiserSearchAction: 'Search Property Records',
    permitSearchAction: 'Search Building Permits',
    taxCollectorAction: 'Pay Property Taxes',
    exposureCategory: 'Wind Exposure Category',
    jurisdictionNotes: 'Permit & Jurisdiction Notes',

    feedbackTitle: 'Add or Correct Information',
    feedbackSubtitle: 'Submit updates directly to Directory Administrator',
    feedbackNoticeTitle: 'Help keep the directory verified and accurate',
    feedbackNoticeDesc: 'Fill out the form below to generate a pre-formatted template sent directly to the Directory Administrator.',
    submissionTypeLabel: 'What would you like to submit?',
    entityNameLabel: 'Entity Name, Jurisdiction or ZIP Code',
    fieldsBeingUpdated: 'Field(s) Being Updated',
    newInfoLabel: 'New / Corrected Information & Specific Changes',
    sourceReferenceLabel: 'Source / Verification Reference (Optional)',
    submitterInfoLabel: 'Your Name / Agency Contact (Optional)',
    btnSendEmailAdmin: 'Send Email to Admin',

    languageSwitch: 'Language / Idioma',
    english: 'English (US)',
    spanish: 'Español (EE. UU. / US)',
    moreLanguages: 'Translate with Google',
    googleTranslateTitle: 'Google Translate (100+ Languages)',
    selectLanguage: 'Choose Translation Language',
    translateDisclaimer: 'Instant automated translation powered by Google Translate.',

    linkCopiedTitle: 'Share Link Copied',
    linkCopiedDesc: 'Direct URL to this tab and record has been copied to your clipboard.'
  },

  es: {
    appTitle: 'Directorio de Cláusulas de Hipoteca y Permisos de Florida',
    appSubtitle: 'Cláusulas de Acreedor Hipotecario ISAOA/ATIMA y Departamentos de Permisos de Construcción en Florida',
    tabMortgages: 'Cláusulas de Hipoteca',
    tabPermits: 'Registros de Propiedad FL',
    tabDisclaimer: 'Aviso Legal',
    btnShare: 'Compartir',
    btnShareCopied: '¡Enlace Copiado!',
    btnShareTooltip: 'Copiar enlace directo compartible para esta vista y registro seleccionado',
    btnAddCorrect: 'Agregar o Corregir',
    btnAddCorrectTooltip: 'Enviar nueva información o sugerir una corrección al Administrador',
    adminMode: 'Modo Administrador',
    adminLogin: 'Iniciar Sesión',
    adminLoginTooltip: 'Autenticación de administrador para editar registros y gestionar la base de datos',
    adminLogout: 'Cerrar Sesión',
    totalRecords: 'Total',
    foundRecords: 'Encontrados',

    searchMortgagePlaceholder: 'Buscar banco/prestamista, ISAOA/ATIMA, dirección, ciudad, estado, código postal...',
    searchPermitPlaceholder: 'Buscar código postal de Florida, ciudad, condado o municipio...',
    searchHintMortgage: 'Consejo: Presione Ctrl+K para buscar. Busque por nombre de acreedor, ISAOA, dirección o correo.',
    searchHintPermit: 'Consejo: Ingrese un código postal de 5 dígitos de Florida para ver Tasador del Condado, Oficina de Permisos y Exposición al Viento.',
    quickViewHint: 'Haga clic en cualquier fila o use las teclas (↑ / ↓) y Enter para abrir Vista Rápida.',
    shortcutHint: 'Presione ? para ver atajos de teclado',

    filterAllTypes: 'Todas las Cláusulas',
    filterMortgageeOnly: 'Solo Acreedor Hipotecario',
    filterLossPayeeOnly: 'Beneficiario de Pérdida / Ambos',
    filterVerifiedOnly: 'Tiene Correo / Portal',
    filterHasEmail: 'Tiene Correo de Servicio',
    filterHasPortal: 'Tiene Portal en Línea',
    sortBy: 'Ordenar por',
    sortNameAsc: 'Nombre (A a Z)',
    sortNameDesc: 'Nombre (Z a A)',
    sortCity: 'Ciudad / Ubicación',
    sortRecentlyUpdated: 'Actualizado Recientemente',
    clearFilters: 'Limpiar Filtros',
    showingResults: 'Mostrando',
    ofRecords: 'de',

    quickView: 'Vista Rápida',
    copyClause: 'Copiar Cláusula',
    clauseCopied: '¡Cláusula Copiada!',
    emailDocs: 'Enviar Docs',
    visitPortal: 'Portal en Línea',
    printSheet: 'Imprimir Hoja',
    suggestCorrection: 'Sugerir Corrección',
    editRecord: 'Editar Registro',
    deleteRecord: 'Eliminar Registro',
    addRecord: 'Agregar Registro',
    exportData: 'Exportar',
    importData: 'Importar',
    bulkLinker: 'Enlazador por Lotes',
    keyboardShortcuts: 'Atajos',

    clauseCardTitle: 'Cláusula Estándar de Acreedor Hipotecario / Beneficiario de Pérdida',
    addLoanNumber: 'Agregar # Préstamo',
    hideFields: 'Ocultar Campos',
    copyFullClause: 'Copiar Cláusula Completa',
    inputLoanNumber: 'Número de Préstamo / Cuenta',
    inputBorrower: 'Asegurado Nombrado / Prestatario',
    inputPolicyNumber: 'Número de Póliza (Opcional)',
    customizerHelperText: 'Al ingresar el Número de Préstamo o Asegurado, la cláusula y la plantilla de correo se actualizan en tiempo real.',

    contactChannelsTitle: 'Canales de Contacto y Servicio',
    phone: 'Teléfono / Línea Gratuita',
    fax: 'Número de FAX',
    email: 'Correo Directo de Servicio',
    onlinePortal: 'Portal de Documentos en Línea',
    noPhone: 'No hay teléfono registrado',
    noFax: 'No hay número de FAX registrado',
    noEmail: 'No hay correo electrónico registrado',
    noPortal: 'No hay portal de carga en línea registrado',
    internalNotes: 'Instrucciones de Servicio y Notas Operativas',

    emailCardTitle: 'Plantilla de Correo para Documentos de Póliza y Factura',
    emailCardSubtitle: 'Correo preformateado para enviar la página de declaraciones y factura al prestamista',
    openEmailDispatcher: 'Despachador de Correo',
    copyEmailTemplate: 'Copiar Plantilla',
    templateCopied: '¡Plantilla Copiada!',
    sendViaMailClient: 'Enviar mediante tu aplicación de correo',
    emailSubject: 'Línea de Asunto',
    copySubject: 'Copiar Asunto',
    copyBody: 'Copiar Cuerpo',
    emailModalTitle: 'Enviar Documentos de Póliza al Acreedor Hipotecario',
    emailModalSubtitle: 'Despachador de Página de Declaraciones y Factura',
    toRecipient: 'Correo del Destinatario (Para)',
    carrierName: 'Nombre de la Compañía Aseguradora',
    includeFooterToggle: 'Incluir pie de página con resumen de la póliza',
    emailWorkflowNote: 'Recuerde adjuntar su PDF de la página de declaraciones y factura en su cliente de correo al abrirlo.',
    emailBodyHello: 'Estimados / Hola,',
    emailBodyMessage: 'Adjunto encontrarán la factura y la página de declaraciones correspondientes al préstamo referenciado arriba.',
    emailBodyPayment: 'Le solicitamos amablemente remitir el pago a la compañía aseguradora para garantizar la continuidad de la cobertura.',
    emailBodyConfirmation: 'Por favor confirmen la fecha programada de pago y número de cheque una vez procesado.',

    permitAppraiserTitle: 'Tasador de Propiedad y Recaudador de Impuestos del Condado',
    permitMunicipalTitle: 'Oficinas Municipales y del Condado para Permisos de Construcción',
    permitWindTitle: 'Código de Construcción de Florida y Exposición al Viento',
    countyLabel: 'Condado',
    zipLabel: 'Código Postal',
    searchCountyPlaceholder: 'Buscar en los 67 Condados de Florida...',
    allCounties: 'Todos los 67 Condados de Florida',
    appraiserSearchAction: 'Buscar Registros de Propiedad',
    permitSearchAction: 'Buscar Permisos de Construcción',
    taxCollectorAction: 'Pagar Impuestos sobre la Propiedad',
    exposureCategory: 'Categoría de Exposición al Viento',
    jurisdictionNotes: 'Notas sobre Permisos y Jurisdicción',

    feedbackTitle: 'Agregar o Corregir Información',
    feedbackSubtitle: 'Envíe actualizaciones directamente al Administrador del Directorio',
    feedbackNoticeTitle: 'Ayude a mantener el directorio verificado y exacto',
    feedbackNoticeDesc: 'Complete el formulario para generar una plantilla de correo enviada directamente al Administrador.',
    submissionTypeLabel: '¿Qué desea enviar?',
    entityNameLabel: 'Nombre de Entidad, Jurisdicción o Código Postal',
    fieldsBeingUpdated: 'Campo(s) que se actualizan',
    newInfoLabel: 'Información Nueva / Corregida y Cambios Específicos',
    sourceReferenceLabel: 'Referencia de Verificación / Fuente (Opcional)',
    submitterInfoLabel: 'Su Nombre / Contacto de Agencia (Opcional)',
    btnSendEmailAdmin: 'Enviar Correo al Administrador',

    languageSwitch: 'Idioma / Language',
    english: 'English (US)',
    spanish: 'Español (EE. UU. / US)',
    moreLanguages: 'Traducir con Google',
    googleTranslateTitle: 'Google Translate (Más de 100 Idiomas)',
    selectLanguage: 'Elegir Idioma de Traducción',
    translateDisclaimer: 'Traducción automática instantánea proporcionada por Google Translate.',

    linkCopiedTitle: 'Enlace Compartible Copiado',
    linkCopiedDesc: 'El enlace directo a esta pestaña y registro se ha copiado a su portapapeles.'
  }
};
