import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  Copy,
  Check,
  Printer,
  Scale,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerViewProps {
  onBackToMortgages?: () => void;
  onBackToProperty?: () => void;
}

export function DisclaimerView({
  onBackToMortgages,
  onBackToProperty
}: DisclaimerViewProps) {
  const { isSpanish } = useLanguage();
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [copiedDisclaimer, setCopiedDisclaimer] = useState(false);

  const mitLicenseText = `MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  const disclaimerTextEn = `All information, mortgagee clauses, contact numbers, email addresses, web portals, fire protection classes (PPC), wind hazard zones, and building department links compiled within this application are provided exclusively for general informational and reference purposes on an 'AS-IS' and 'AS-AVAILABLE' basis, without warranties of any kind, whether express or implied.

Neither the author, maintainer, nor host assumes any legal liability, obligation, or responsibility for errors, omissions, outdated mortgagee clauses, unverified phone/fax numbers, or miscalculated insurance rating parameters. It is the sole obligation and professional duty of the licensed insurance agent or user to independently verify all mortgagee clauses, loss payee endorsements, building permits, and underwriting criteria with the respective lending institution, property appraiser, or county authority prior to binding policies or issuing certificates of insurance.`;

  const disclaimerTextEs = `Toda la información, cláusulas de acreedor hipotecario, números de contacto, correos electrónicos, portales web, clases de protección contra incendios (PPC), zonas de peligro de viento y enlaces de departamentos de permisos compilados en esta aplicación se proporcionan exclusivamente con fines informativos y de referencia general bajo la modalidad 'TAL CUAL' y 'SEGÚN DISPONIBILIDAD', sin garantías de ningún tipo, ya sean expresas o implícitas.

Ni el autor, mantenedor o anfitrión asume responsabilidad legal u obligación por errores, omisiones, cláusulas hipotecarias desactualizadas, números de teléfono/fax no verificados o parámetros de tarificación de seguros mal calculados. Es obligación exclusiva y deber profesional del agente de seguros con licencia o usuario verificar de forma independiente todas las cláusulas hipotecarias, endosos de beneficiario de pérdida, permisos de construcción y criterios de suscripción con la institución prestamista, tasador de propiedad o autoridad del condado antes de emitir pólizas o certificados de seguro.`;

  const currentDisclaimer = isSpanish ? disclaimerTextEs : disclaimerTextEn;

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(mitLicenseText).then(() => {
      setCopiedLicense(true);
      setTimeout(() => setCopiedLicense(false), 2200);
    });
  };

  const handleCopyDisclaimer = () => {
    navigator.clipboard.writeText(currentDisclaimer).then(() => {
      setCopiedDisclaimer(true);
      setTimeout(() => setCopiedDisclaimer(false), 2200);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 px-3 sm:px-4 text-[#222]">
      {/* Quick Navigation / Breadcrumb Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-600">
          <span className="font-semibold text-neutral-800">Agency Directory Portal</span>
          <span>/</span>
          <span className="text-neutral-500">
            {isSpanish ? 'Avisos Legales, Términos y Licencia' : 'Legal, Terms & Open Source Notices'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onBackToMortgages && (
            <button
              onClick={onBackToMortgages}
              className="text-[#2b6cb0] hover:underline font-semibold cursor-pointer"
            >
              {isSpanish ? '← Volver a Hipotecas' : '← Back to Mortgages'}
            </button>
          )}
          {onBackToProperty && (
            <button
              onClick={onBackToProperty}
              className="text-[#2b6cb0] hover:underline font-semibold cursor-pointer ml-3"
            >
              {isSpanish ? '← Volver a Registros FL' : '← Back to FL Property Records'}
            </button>
          )}
        </div>
      </div>

      {/* Main Document Card */}
      <div className="bg-white border border-[#d2d6dc] rounded-sm p-6 sm:p-8 shadow-sm">
        {/* Document Header */}
        <div className="border-b border-[#e5e7eb] pb-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] mb-2 uppercase tracking-wide">
                <Scale className="w-3.5 h-3.5 text-[#1e40af]" />
                <span>{isSpanish ? 'Divulgación Legal y Licencias' : 'Legal Disclosure & Licensing'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                {isSpanish
                  ? 'Términos de Uso, Descargo de Responsabilidad y Licencia de Código Abierto'
                  : 'Terms of Use, Liability Disclaimer & Open Source Notice'}
              </h1>
              <p className="text-xs sm:text-sm text-[#4b5563] mt-1 font-medium">
                {isSpanish
                  ? 'Herramienta informativa y de referencia interna para profesionales de seguros'
                  : 'Internal Reference & Informational Tool for Insurance Professionals'}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-neutral-500 block">
                Document Version 2.5
              </span>
              <span className="text-[11px] text-neutral-400">
                Effective: Current Agency Session
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: General Disclaimer of Liability ("AS-IS" Clause) */}
        <section id="terms-of-use" className="mb-8 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                {isSpanish
                  ? '1. Descargo General de Responsabilidad (Cláusula "TAL CUAL")'
                  : '1. General Disclaimer of Liability ("AS-IS" Clause)'}
              </span>
            </h2>
            <button
              onClick={handleCopyDisclaimer}
              className="text-xs text-[#2b6cb0] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedDisclaimer ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">{isSpanish ? 'Copiado' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{isSpanish ? 'Copiar Descargo' : 'Copy Disclaimer'}</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded p-4 text-[#78350f] text-[13px] leading-relaxed space-y-3">
            {isSpanish ? (
              <>
                <p>
                  Toda la información, cláusulas de acreedor hipotecario, números de contacto, correos electrónicos, portales web, clases de protección contra incendios (PPC), zonas de peligro de viento y enlaces de departamentos de permisos compilados en esta aplicación se proporcionan exclusivamente con fines informativos y de referencia general bajo la modalidad <strong className="font-bold text-neutral-900">"TAL CUAL" y "SEGÚN DISPONIBILIDAD"</strong>, sin garantías de ningún tipo, ya sean expresas o implícitas.
                </p>
                <p>
                  Ni el autor, mantenedor o anfitrión asume responsabilidad legal u obligación por errores, omisiones, cláusulas hipotecarias desactualizadas, números de teléfono/fax no verificados o parámetros de tarificación de seguros mal calculados. Es obligación exclusiva y deber profesional del agente de seguros con licencia o usuario verificar de forma independiente todas las cláusulas hipotecarias, endosos de beneficiario de pérdida, permisos de construcción y criterios de suscripción con la institución prestamista, tasador de propiedad o autoridad del condado antes de emitir pólizas o certificados de seguro.
                </p>
              </>
            ) : (
              <>
                <p>
                  All information, mortgagee clauses, contact numbers, email addresses, web portals,
                  fire protection classes (PPC), wind hazard zones, and building department links
                  compiled within this application are provided exclusively for general informational
                  and reference purposes on an <strong className="font-bold text-neutral-900">"AS-IS" and "AS-AVAILABLE" basis</strong>,
                  without warranties of any kind, whether express or implied.
                </p>
                <p>
                  Neither the author, maintainer, nor host assumes any legal liability, obligation, or
                  responsibility for errors, omissions, outdated mortgagee clauses, unverified
                  phone/fax numbers, or miscalculated insurance rating parameters. It is the sole
                  obligation and professional duty of the licensed insurance agent or user to
                  independently verify all mortgagee clauses, loss payee endorsements, building
                  permits, and underwriting criteria with the respective lending institution, property
                  appraiser, or county authority prior to binding policies or issuing certificates of
                  insurance.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Section 2: Independent Third-Party Directory Notice */}
        <section className="mb-8">
          <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>
              {isSpanish
                ? '2. Aviso de Directorio Independiente de Terceros'
                : '2. Independent Third-Party Directory Notice'}
            </span>
          </h2>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded p-4 text-[#334155] text-[13px] leading-relaxed space-y-2">
            <p>
              {isSpanish
                ? 'Todos los nombres, marcas registradas y enlaces de bancos, uniones de crédito, administradores y agencias gubernamentales referenciados en este directorio son propiedad intelectual de sus respectivos dueños. Su inclusión no implica patrocinio, afiliación ni respaldo.'
                : 'All bank, credit union, servicer, municipal, and governmental agency names, trademarks, and links referenced within this directory are the intellectual property of their respective owners. Their inclusion does not imply sponsorship, affiliation, partnership, or endorsement.'}
            </p>
            <p className="text-[12px] text-[#64748b]">
              {isSpanish
                ? 'Esta aplicación funciona estrictamente como una guía de referencia neutral para operaciones de agencias.'
                : 'This application functions strictly as a neutral, client-side reference workbook and productivity utility for agency operations.'}
            </p>
          </div>
        </section>

        {/* Section 3: MIT Open Source Software License Notice */}
        <section id="mit-license" className="mb-4 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>3. MIT Open Source Software License Notice</span>
            </h2>
            <button
              onClick={handleCopyLicense}
              className="text-xs text-[#2b6cb0] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedLicense ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">{isSpanish ? 'Copiado' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{isSpanish ? 'Copiar Licencia MIT' : 'Copy MIT License'}</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="bg-[#1e293b] text-[#e2e8f0] p-4 sm:p-5 rounded-md font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap border border-[#334155] shadow-inner select-all">
{mitLicenseText}
            </pre>
          </div>
        </section>

        {/* Agency Compliance Footer Note */}
        <div className="mt-8 pt-4 border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6b7280]">
          <div>
            <span>Agency Directory Portal • White-Label Insurance Utilities</span>
          </div>
          <div>
            <span>Independent Reference Tool • For Professional Use Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
