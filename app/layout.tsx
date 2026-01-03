import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mari Campos | Silencie - Programa de Meditacao Guiada de 21 dias",
  description: "Mari Campos e professora de yoga e meditacao. Conheca o Silencie, programa de meditacao guiada de 21 dias para acalmar a mente, sair da ansiedade e criar clareza emocional.",
  keywords: [
    // Mari Campos
    "Mari Campos",
    "Mari Campos yoga",
    "Mari Campos meditacao",
    "Mari Campos professora",
    "maricamposyogi",
    // Silencie
    "Silencie",
    "programa Silencie",
    // Meditacao
    "meditacao",
    "meditacao guiada",
    "meditacao para iniciantes",
    "meditacao online",
    "programa de meditacao",
    "curso de meditacao",
    "21 dias de meditacao",
    "aprender a meditar",
    "como meditar",
    "meditacao para ansiedade",
    "meditacao para dormir",
    "meditacao mindfulness",
    // Yoga
    "yoga",
    "aula de yoga",
    "yoga online",
    "yoga para iniciantes",
    "professora de yoga",
    // Mindfulness
    "mindfulness",
    "atencao plena",
    "presenca",
    "consciencia plena",
    // Bem-estar mental
    "ansiedade",
    "como controlar ansiedade",
    "acalmar a mente",
    "clareza mental",
    "equilibrio emocional",
    "saude mental",
    "bem-estar",
    // Autoconhecimento
    "autoconhecimento",
    "desenvolvimento pessoal",
    "transformacao pessoal",
    "silencio interior",
    "paz interior",
    // Respiracao
    "respiracao consciente",
    "tecnicas de respiracao",
  ],
  authors: [{ name: "Mari Campos", url: "https://instagram.com/maricamposyogi" }],
  creator: "Mari Campos",
  publisher: "Mari Campos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Mari Campos - Silencie",
    title: "Mari Campos | Silencie - Programa de Meditacao Guiada",
    description: "Mari Campos e professora de yoga e meditacao. Conheca o Silencie, programa de meditacao guiada de 21 dias para transformar sua relacao com a mente.",
    images: [
      {
        url: "/photos/mari.webp",
        width: 1200,
        height: 630,
        alt: "Mari Campos - Professora de Yoga e Meditacao",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mari Campos | Silencie - Meditacao Guiada de 21 dias",
    description: "Mari Campos e professora de yoga e meditacao. Conheca o Silencie para acalmar a mente e criar clareza emocional.",
    creator: "@maricamposyogi",
    images: ["/photos/mari.webp"],
  },
  alternates: {
    canonical: "https://silencie.com.br",
  },
  category: "health",
  other: {
    "instagram:creator": "@maricamposyogi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#657E66" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="canonical" href="https://silencie.com.br" />
        {/* Google Analytics with Enhanced Tracking */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FR56MV1RP0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FR56MV1RP0', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true
              });

              // Track scroll depth
              var scrollDepths = [25, 50, 75, 100];
              var scrollDepthsReached = [];
              window.addEventListener('scroll', function() {
                var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
                scrollDepths.forEach(function(depth) {
                  if (scrollPercent >= depth && scrollDepthsReached.indexOf(depth) === -1) {
                    scrollDepthsReached.push(depth);
                    gtag('event', 'scroll_depth', {
                      event_category: 'engagement',
                      event_label: depth + '%',
                      value: depth
                    });
                  }
                });
              });

              // Track time on page
              var timeOnPage = 0;
              setInterval(function() {
                timeOnPage += 30;
                if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 180 || timeOnPage === 300) {
                  gtag('event', 'time_on_page', {
                    event_category: 'engagement',
                    event_label: timeOnPage + ' seconds',
                    value: timeOnPage
                  });
                }
              }, 30000);

              // Track CTA clicks (WhatsApp)
              document.addEventListener('click', function(e) {
                var target = e.target.closest('a');
                if (target && target.href && target.href.includes('wa.me')) {
                  gtag('event', 'whatsapp_click', {
                    event_category: 'conversion',
                    event_label: target.textContent.trim(),
                    value: 1
                  });
                  gtag('event', 'conversion', {
                    send_to: 'G-FR56MV1RP0',
                    event_category: 'lead',
                    event_label: 'WhatsApp CTA'
                  });
                }
              });

              // Track Instagram click
              document.addEventListener('click', function(e) {
                var target = e.target.closest('a');
                if (target && target.href && target.href.includes('instagram.com')) {
                  gtag('event', 'instagram_click', {
                    event_category: 'social',
                    event_label: 'Instagram Profile',
                    value: 1
                  });
                }
              });

              // Track FAQ interactions
              document.addEventListener('click', function(e) {
                var target = e.target.closest('button');
                if (target && target.closest('[class*="border-green"]')) {
                  var questionText = target.textContent.trim().substring(0, 50);
                  gtag('event', 'faq_click', {
                    event_category: 'engagement',
                    event_label: questionText
                  });
                }
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://silencie.com.br/#mari-campos",
                  "name": "Mari Campos",
                  "alternateName": "maricamposyogi",
                  "description": "Professora de yoga e meditacao, facilitadora de processos de autoconhecimento. Ha mais de uma decada dedica-se ao estudo e transmissao de tecnicas de meditacao, yoga e presenca.",
                  "jobTitle": "Professora de Yoga e Meditacao",
                  "url": "https://silencie.com.br",
                  "image": "https://silencie.com.br/photos/mari.webp",
                  "sameAs": [
                    "https://instagram.com/maricamposyogi"
                  ],
                  "knowsAbout": ["Yoga", "Meditacao", "Mindfulness", "Autoconhecimento", "Respiracao Consciente"]
                },
                {
                  "@type": "Course",
                  "@id": "https://silencie.com.br/#silencie",
                  "name": "Silencie - Programa de Meditacao Guiada de 21 dias",
                  "description": "Programa de meditacao guiada de 21 dias para acalmar a mente, sair da ansiedade e criar clareza emocional no dia a dia.",
                  "provider": {
                    "@type": "Person",
                    "@id": "https://silencie.com.br/#mari-campos"
                  },
                  "instructor": {
                    "@type": "Person",
                    "@id": "https://silencie.com.br/#mari-campos"
                  },
                  "hasCourseInstance": {
                    "@type": "CourseInstance",
                    "courseMode": "online",
                    "duration": "P21D"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://silencie.com.br/#website",
                  "url": "https://silencie.com.br",
                  "name": "Mari Campos - Silencie",
                  "description": "Site oficial de Mari Campos e do programa Silencie",
                  "publisher": {
                    "@type": "Person",
                    "@id": "https://silencie.com.br/#mari-campos"
                  },
                  "inLanguage": "pt-BR"
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Nunca meditei. Posso fazer o Silencie?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sim. As meditacoes sao guiadas e progressivas. Voce nao precisa ter experiencia previa."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quanto tempo por dia preciso dedicar para meditar?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Entre 15 a 20 minutos por dia."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "O que e meditacao guiada?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Meditacao guiada e uma pratica onde um instrutor conduz voce atraves do processo de meditacao com instrucoes passo a passo. O programa Silencie de Mari Campos oferece meditacoes guiadas diarias por 21 dias."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quem e Mari Campos?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Mari Campos e professora de yoga e meditacao e facilitadora de processos de autoconhecimento. Ha mais de uma decada, dedica-se ao estudo, a pratica e a transmissao de tecnicas de meditacao, yoga, respiracao consciente e presenca."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
