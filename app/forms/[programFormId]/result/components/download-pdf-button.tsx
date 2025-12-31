"use client";

import { useState } from "react";

interface DownloadPdfButtonProps {
  programFormId: string;
  programName: string;
  formName: string;
  noiseScore: number;
  powerScore: number;
  noiseInterpretation: string;
  recommendation: string;
  completedAt: string;
}

export default function DownloadPdfButton({
  programName,
  formName,
  noiseScore,
  powerScore,
  noiseInterpretation,
  recommendation,
  completedAt,
}: DownloadPdfButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);

    try {
      // Create a printable HTML content
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Diagnóstico - ${formName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #657E66;
            }
            .header h1 {
              color: #657E66;
              font-size: 28px;
              font-weight: 300;
              margin-bottom: 8px;
            }
            .header p {
              color: #5a5a5a;
              font-size: 14px;
            }
            .scores {
              display: flex;
              gap: 20px;
              margin-bottom: 30px;
            }
            .score-box {
              flex: 1;
              background: #F4F2DC;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
            }
            .score-box h3 {
              color: #5a5a5a;
              font-size: 14px;
              margin-bottom: 8px;
            }
            .score-box .value {
              font-size: 48px;
              font-weight: 300;
              color: #657E66;
            }
            .score-box .max {
              color: #5a5a5a;
              font-size: 12px;
            }
            .interpretation {
              background: #fff;
              border: 1px solid #657E66;
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 30px;
            }
            .interpretation h3 {
              color: #657E66;
              font-size: 18px;
              margin-bottom: 16px;
            }
            .interpretation-item {
              margin-bottom: 16px;
            }
            .interpretation-item:last-child {
              margin-bottom: 0;
              padding-top: 16px;
              border-top: 1px solid #eee;
            }
            .interpretation-item label {
              display: block;
              color: #5a5a5a;
              font-size: 12px;
              margin-bottom: 4px;
            }
            .interpretation-item p {
              font-size: 16px;
            }
            .scale-guide {
              background: #F4F2DC;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 30px;
            }
            .scale-guide h4 {
              color: #657E66;
              font-size: 14px;
              margin-bottom: 12px;
            }
            .scale-guide p {
              font-size: 13px;
              margin-bottom: 4px;
            }
            .footer {
              text-align: center;
              color: #5a5a5a;
              font-size: 12px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Diagnóstico de Mente, Presença e Regulação Emocional</h1>
            <p>${programName} • ${formName}</p>
          </div>

          <div class="scores">
            <div class="score-box">
              <h3>Nota de Ruído Interno</h3>
              <div class="value">${Math.round(noiseScore)}</div>
              <div class="max">de 100</div>
            </div>
            <div class="score-box">
              <h3>Índice de Potência</h3>
              <div class="value">${Math.round(powerScore)}</div>
              <div class="max">de 100</div>
            </div>
          </div>

          <div class="interpretation">
            <h3>O que isso significa</h3>
            <div class="interpretation-item">
              <label>Seu nível de ruído:</label>
              <p>${noiseInterpretation}</p>
            </div>
            <div class="interpretation-item">
              <label>Recomendação:</label>
              <p>${recommendation}</p>
            </div>
          </div>

          <div class="scale-guide">
            <h4>Como ler sua nota de ruído:</h4>
            <p><strong>0 a 20:</strong> Mente mais calma e regulada</p>
            <p><strong>21 a 40:</strong> Ruído moderado, com bons recursos</p>
            <p><strong>41 a 60:</strong> Ruído alto, atenção e energia bem drenadas</p>
            <p><strong>61 a 80:</strong> Sobrecarga, piloto automático dominando</p>
            <p><strong>81 a 100:</strong> Alerta máximo, urgência de reorganização interna</p>
            <p style="margin-top: 12px; color: #5a5a5a;">No final do programa, a meta é reduzir a nota. Quanto menor, mais transformação.</p>
          </div>

          <div class="footer">
            <p>Preenchido em ${new Date(completedAt).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p style="margin-top: 8px;">Silencie • ${programName}</p>
          </div>
        </body>
        </html>
      `;

      // Open in new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="px-6 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
    >
      {generating ? "Gerando..." : "Baixar PDF"}
    </button>
  );
}
