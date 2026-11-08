import type { Faq, Mode, SeoPage } from './pages';

/*
  Translated SEO pages. Each language pack below is hand-written text; the pages are generated from it by buildLangPages().
  To add a language: add a pack to PACKS (same shape) and it appears in the routes, sitemap, footer and hreflang links.
*/

export interface LangUi {
  skip: string; home: string; faq: string; related: string;
  ctaBefore: string; ctaLink: string; ctaAfter: string;
  tools: string; guides: string; about: string; footerLine: string; english: string;
  yourText: string; oneItem: string; copy: string; copied: string; bulletStyle: string;
}
interface PageText {
  slug: string; label: string; title: string; h1: string; desc: string; intro: string;
  usesTitle: string; uses: string[]; faq: Faq[];
}
interface Pack {
  code: string; name: string; locale: string; ui: LangUi;
  howTitle: string; steps: string[];
  whyTitle: string; why: string[];
  careTitle: string; care: string[];
  bold: PageText; italic: PageText; strike: PageText; bullets: PageText;
}

const PACKS: Pack[] = [
  /* ------------------------------------------------------------------ Spanish */
  {
    code: 'es', name: 'Español', locale: 'es_ES',
    ui: {
      skip: 'Saltar al contenido', home: 'LekhKit', faq: 'Preguntas frecuentes', related: 'Relacionado',
      ctaBefore: '¿Vas a escribir una publicación completa?', ctaLink: 'Abre el editor de LekhKit', ctaAfter: 'con negrita, cursiva, listas, emojis y vista previa en escritorio y móvil.',
      tools: 'Herramientas', guides: 'Guías', about: 'LekhKit',
      footerLine: 'Formateador gratuito para publicaciones de LinkedIn. Tu texto se queda en tu navegador y nunca se sube. No está afiliado a LinkedIn.', english: 'English version',
      yourText: 'Tu texto', oneItem: 'Un elemento por línea', copy: 'Copiar', copied: 'Copiado', bulletStyle: 'Estilo de viñeta',
    },
    howTitle: 'Cómo usarlo en LinkedIn',
    steps: ['Escribe o pega tu texto en la caja de arriba.', 'Copia el resultado.', 'Pégalo en tu publicación, comentario, titular o sección Acerca de de LinkedIn.'],
    whyTitle: 'Por qué LinkedIn no tiene este formato',
    why: [
      'El cuadro de publicación de LinkedIn solo acepta texto plano. Por eso las herramientas como esta usan caracteres Unicode: el estándar incluye alfabetos completos con estilos distintos, y se pegan en cualquier lugar donde se permite texto.',
      'Para LinkedIn son caracteres normales, así que el estilo se mantiene al publicar. No es formato como el de un procesador de textos.',
    ],
    careTitle: 'Antes de publicar',
    care: [
      'Las letras con tilde y la ñ (á, é, ñ, ü) no tienen versión con estilo y se quedan como las escribiste.',
      'Algunos lectores de pantalla leen estos caracteres letra por letra. Usa el estilo solo en frases cortas.',
      'La búsqueda de LinkedIn puede no reconocer palabras escritas con estos caracteres. Deja tus palabras clave en texto normal.',
    ],
    bold: {
      slug: 'generador-texto-negrita-linkedin', label: 'Generador de texto en negrita',
      title: 'Generador de Texto en Negrita para LinkedIn | LekhKit',
      h1: 'Generador de texto en negrita para LinkedIn',
      desc: 'Escribe en negrita en LinkedIn: publicaciones, comentarios y titular. Gratis, sin registro, y tu texto no sale de tu navegador.',
      intro: 'LinkedIn no tiene botón de negrita en las publicaciones. Escribe abajo, copia el texto en negrita y pégalo donde quieras.',
      usesTitle: 'Cuándo conviene usar negrita',
      uses: ['En la primera línea, para que la gente se detenga a leer.', 'En dos o tres frases clave dentro de una publicación larga.', 'En los títulos de una lista de pasos.', 'En una sola palabra de tu titular.'],
      faq: [
        { q: '¿Funciona en comentarios y mensajes?', a: 'Sí. Son caracteres de texto, así que se pegan en publicaciones, comentarios, mensajes, titular y Acerca de.' },
        { q: '¿Es gratis?', a: 'Sí. LekhKit es gratuito, sin cuentas ni anuncios, y el texto se procesa en tu navegador.' },
        { q: '¿Se ve igual en todos los teléfonos?', a: 'En los dispositivos actuales, casi siempre. Los muy antiguos pueden mostrar cuadros vacíos.' },
      ],
    },
    italic: {
      slug: 'generador-texto-cursiva-linkedin', label: 'Generador de texto en cursiva',
      title: 'Generador de Texto en Cursiva para LinkedIn | LekhKit',
      h1: 'Generador de texto en cursiva para LinkedIn',
      desc: 'Crea texto en cursiva para publicaciones y comentarios de LinkedIn. Copia y pega. Gratis y privado, sin subir nada.',
      intro: 'La cursiva sirve para dar énfasis suave, una cita o un comentario aparte. Escribe abajo y copia la versión en cursiva.',
      usesTitle: 'Buenos usos de la cursiva',
      uses: ['Citas y frases cortas dentro de una historia.', 'Títulos de libros, artículos o pódcast.', 'Un comentario al margen entre paréntesis.', 'Una pregunta final para tus lectores.'],
      faq: [
        { q: '¿Puedo combinar cursiva y negrita?', a: 'Sí. En el editor completo de LekhKit puedes usar negrita, cursiva, subrayado y tachado, y mezclarlos.' },
        { q: '¿Por qué necesito un generador?', a: 'Porque LinkedIn solo acepta texto plano en las publicaciones. El generador cambia cada letra por su equivalente en cursiva de Unicode.' },
      ],
    },
    strike: {
      slug: 'texto-tachado-linkedin', label: 'Texto tachado',
      title: 'Texto Tachado para LinkedIn: Generador Gratis | LekhKit',
      h1: 'Texto tachado para LinkedIn',
      desc: 'Tacha palabras en publicaciones y comentarios de LinkedIn. Generador gratis: escribe, copia y pega. Funciona en tu navegador.',
      intro: 'El tachado permite mostrar una corrección o un cambio de plan sin borrar las palabras originales. Escribe abajo y copia el texto tachado.',
      usesTitle: 'Para qué se usa el tachado',
      uses: ['Antes y después: una idea vieja tachada y la nueva a continuación.', 'Corregir una cifra o una fecha.', 'Un comentario con humor.', 'Listas de cosas que dejaste de hacer.'],
      faq: [
        { q: '¿La línea se ve en todos los dispositivos?', a: 'En los actuales, sí. El grosor y la altura de la línea pueden variar un poco según la fuente.' },
        { q: '¿Cómo se hace?', a: 'Se usa un carácter combinable que añade una pequeña línea sobre cada letra. Como va unido al texto normal, se pega sin problema.' },
      ],
    },
    bullets: {
      slug: 'vinetas-para-linkedin', label: 'Viñetas para LinkedIn',
      title: 'Viñetas para LinkedIn: Copia y Pega Listas | LekhKit',
      h1: 'Viñetas y listas para LinkedIn',
      desc: 'Añade viñetas a tus publicaciones de LinkedIn. Escribe un elemento por línea, elige el símbolo y copia la lista. Gratis y privado.',
      intro: 'LinkedIn no convierte los guiones en listas. Escribe un elemento por línea, elige un estilo de viñeta y copia una lista limpia.',
      usesTitle: 'Consejos para listas fáciles de leer',
      uses: ['Una idea por línea, y que quepa en una sola.', 'Empieza todos los elementos igual, por ejemplo con un verbo.', 'Deja una línea en blanco antes y después de la lista.', 'De cinco a siete elementos son suficientes.'],
      faq: [
        { q: '¿Por qué no usar un guion?', a: 'Un guion funciona, pero una viñeta real se ve mejor y se reconoce como lista a primera vista.' },
        { q: '¿Funciona en la app móvil?', a: 'Sí. Son caracteres normales y se ven en la app y en la web de LinkedIn.' },
      ],
    },
  },

  /* ---------------------------------------------------------------- Portuguese */
  {
    code: 'pt', name: 'Português', locale: 'pt_BR',
    ui: {
      skip: 'Ir para o conteúdo', home: 'LekhKit', faq: 'Perguntas frequentes', related: 'Relacionados',
      ctaBefore: 'Vai escrever um post completo?', ctaLink: 'Abra o editor do LekhKit', ctaAfter: 'com negrito, itálico, listas, emojis e prévia no desktop e no celular.',
      tools: 'Ferramentas', guides: 'Guias', about: 'LekhKit',
      footerLine: 'Formatador gratuito de posts do LinkedIn. Seu texto fica no navegador e nunca é enviado. Sem vínculo com o LinkedIn.', english: 'English version',
      yourText: 'Seu texto', oneItem: 'Um item por linha', copy: 'Copiar', copied: 'Copiado', bulletStyle: 'Estilo do marcador',
    },
    howTitle: 'Como usar no LinkedIn',
    steps: ['Digite ou cole seu texto na caixa acima.', 'Copie o resultado.', 'Cole no seu post, comentário, título profissional ou seção Sobre do LinkedIn.'],
    whyTitle: 'Por que o LinkedIn não tem essa formatação',
    why: [
      'A caixa de publicação do LinkedIn aceita apenas texto simples. Por isso ferramentas como esta usam caracteres Unicode: o padrão inclui alfabetos inteiros com estilos diferentes, que podem ser colados onde texto simples é permitido.',
      'Para o LinkedIn, são caracteres comuns, então o estilo permanece depois de publicar. Não é formatação como a de um editor de texto.',
    ],
    careTitle: 'Antes de publicar',
    care: [
      'Letras acentuadas e o ç (á, ã, é, ç) não têm versão estilizada e continuam como você digitou.',
      'Alguns leitores de tela leem esses caracteres letra por letra. Use o estilo só em frases curtas.',
      'A busca do LinkedIn pode não reconhecer palavras escritas com esses caracteres. Mantenha suas palavras-chave em texto normal.',
    ],
    bold: {
      slug: 'gerador-de-texto-negrito-linkedin', label: 'Gerador de texto em negrito',
      title: 'Gerador de Texto em Negrito para LinkedIn | LekhKit',
      h1: 'Gerador de texto em negrito para LinkedIn',
      desc: 'Escreva em negrito no LinkedIn: posts, comentários e título. Grátis, sem cadastro, e seu texto não sai do navegador.',
      intro: 'O LinkedIn não tem botão de negrito nos posts. Digite abaixo, copie o texto em negrito e cole onde quiser.',
      usesTitle: 'Quando usar negrito',
      uses: ['Na primeira linha, para fazer a pessoa parar de rolar.', 'Em duas ou três frases-chave de um post longo.', 'Nos títulos de uma lista de passos.', 'Em uma única palavra do seu título profissional.'],
      faq: [
        { q: 'Funciona em comentários e mensagens?', a: 'Sim. São caracteres de texto, então colam em posts, comentários, mensagens, título e Sobre.' },
        { q: 'É grátis?', a: 'Sim. O LekhKit é gratuito, sem conta e sem anúncios, e o texto é processado no seu navegador.' },
        { q: 'Aparece igual em todo celular?', a: 'Nos aparelhos atuais, quase sempre. Aparelhos muito antigos podem mostrar quadrados vazios.' },
      ],
    },
    italic: {
      slug: 'gerador-de-texto-italico-linkedin', label: 'Gerador de texto em itálico',
      title: 'Gerador de Texto em Itálico para LinkedIn | LekhKit',
      h1: 'Gerador de texto em itálico para LinkedIn',
      desc: 'Crie texto em itálico para posts e comentários do LinkedIn. Copie e cole. Grátis e privado, nada é enviado.',
      intro: 'O itálico dá ênfase suave, destaca uma citação ou um comentário paralelo. Digite abaixo e copie a versão em itálico.',
      usesTitle: 'Bons usos do itálico',
      uses: ['Citações e frases curtas dentro de uma história.', 'Títulos de livros, artigos ou podcasts.', 'Um comentário entre parênteses.', 'Uma pergunta final para os leitores.'],
      faq: [
        { q: 'Posso combinar itálico e negrito?', a: 'Sim. No editor completo do LekhKit você usa negrito, itálico, sublinhado e tachado, e pode misturá-los.' },
        { q: 'Por que preciso de um gerador?', a: 'Porque o LinkedIn só aceita texto simples nos posts. O gerador troca cada letra pelo equivalente em itálico do Unicode.' },
      ],
    },
    strike: {
      slug: 'texto-riscado-linkedin', label: 'Texto riscado',
      title: 'Texto Riscado para LinkedIn: Gerador Grátis | LekhKit',
      h1: 'Texto riscado para LinkedIn',
      desc: 'Risque palavras em posts e comentários do LinkedIn. Gerador grátis: digite, copie e cole. Funciona no seu navegador.',
      intro: 'O texto riscado mostra uma correção ou mudança de plano sem apagar as palavras originais. Digite abaixo e copie o texto riscado.',
      usesTitle: 'Para que serve o texto riscado',
      uses: ['Antes e depois: uma ideia antiga riscada e a nova em seguida.', 'Corrigir um número ou uma data.', 'Um comentário bem-humorado.', 'Listas do que você parou de fazer.'],
      faq: [
        { q: 'A linha aparece em todos os aparelhos?', a: 'Nos atuais, sim. A espessura e a altura da linha podem variar um pouco conforme a fonte.' },
        { q: 'Como funciona?', a: 'Usa-se um caractere combinável que coloca um pequeno traço sobre cada letra. Como fica junto do texto normal, cola sem problema.' },
      ],
    },
    bullets: {
      slug: 'marcadores-para-linkedin', label: 'Marcadores para LinkedIn',
      title: 'Marcadores para LinkedIn: Copie e Cole Listas | LekhKit',
      h1: 'Marcadores e listas para LinkedIn',
      desc: 'Adicione marcadores aos seus posts do LinkedIn. Escreva um item por linha, escolha o símbolo e copie a lista. Grátis e privado.',
      intro: 'O LinkedIn não transforma hifens em listas. Escreva um item por linha, escolha um estilo de marcador e copie uma lista limpa.',
      usesTitle: 'Dicas para listas fáceis de ler',
      uses: ['Uma ideia por linha, e que caiba em uma linha só.', 'Comece todos os itens do mesmo jeito, por exemplo com um verbo.', 'Deixe uma linha em branco antes e depois da lista.', 'De cinco a sete itens já é o bastante.'],
      faq: [
        { q: 'Por que não usar hífen?', a: 'O hífen funciona, mas um marcador de verdade aparece melhor e é reconhecido como lista logo de cara.' },
        { q: 'Funciona no app do celular?', a: 'Sim. São caracteres comuns e aparecem no app e no site do LinkedIn.' },
      ],
    },
  },

  /* -------------------------------------------------------------------- French */
  {
    code: 'fr', name: 'Français', locale: 'fr_FR',
    ui: {
      skip: 'Aller au contenu', home: 'LekhKit', faq: 'Questions fréquentes', related: 'À lire aussi',
      ctaBefore: 'Vous écrivez une publication complète ?', ctaLink: 'Ouvrez l’éditeur LekhKit', ctaAfter: 'avec gras, italique, listes, emojis et aperçu ordinateur et mobile.',
      tools: 'Outils', guides: 'Guides', about: 'LekhKit',
      footerLine: 'Formateur gratuit de publications LinkedIn. Votre texte reste dans votre navigateur et n’est jamais envoyé. Sans lien avec LinkedIn.', english: 'English version',
      yourText: 'Votre texte', oneItem: 'Un élément par ligne', copy: 'Copier', copied: 'Copié', bulletStyle: 'Style de puce',
    },
    howTitle: 'Comment l’utiliser sur LinkedIn',
    steps: ['Saisissez ou collez votre texte dans la zone ci-dessus.', 'Copiez le résultat.', 'Collez-le dans votre publication, commentaire, titre ou section À propos sur LinkedIn.'],
    whyTitle: 'Pourquoi LinkedIn n’a pas cette mise en forme',
    why: [
      'La zone de publication de LinkedIn n’accepte que du texte brut. Les outils comme celui-ci utilisent donc des caractères Unicode : la norme contient des alphabets entiers dans des styles différents, qui se collent partout où le texte brut est permis.',
      'Pour LinkedIn, ce sont des caractères ordinaires, donc le style reste après la publication. Ce n’est pas une mise en forme comme dans un traitement de texte.',
    ],
    careTitle: 'Avant de publier',
    care: [
      'Les lettres accentuées et le ç (é, è, à, ç) n’ont pas de version stylisée et restent telles quelles.',
      'Certains lecteurs d’écran lisent ces caractères lettre par lettre. Réservez le style à de courtes phrases.',
      'La recherche LinkedIn peut ne pas reconnaître les mots écrits avec ces caractères. Gardez vos mots-clés en texte normal.',
    ],
    bold: {
      slug: 'generateur-texte-gras-linkedin', label: 'Générateur de texte en gras',
      title: 'Générateur de Texte en Gras pour LinkedIn | LekhKit',
      h1: 'Générateur de texte en gras pour LinkedIn',
      desc: 'Écrivez en gras sur LinkedIn : publications, commentaires et titre. Gratuit, sans inscription, et votre texte ne quitte pas votre navigateur.',
      intro: 'LinkedIn n’a pas de bouton gras dans les publications. Saisissez votre texte ci-dessous, copiez la version en gras et collez-la où vous voulez.',
      usesTitle: 'Quand utiliser le gras',
      uses: ['Sur la première ligne, pour arrêter le défilement.', 'Sur deux ou trois expressions clés d’une longue publication.', 'Pour les intitulés d’une liste d’étapes.', 'Sur un seul mot de votre titre.'],
      faq: [
        { q: 'Est-ce que ça marche dans les commentaires et les messages ?', a: 'Oui. Ce sont des caractères de texte, ils se collent dans les publications, commentaires, messages, titre et À propos.' },
        { q: 'Est-ce gratuit ?', a: 'Oui. LekhKit est gratuit, sans compte ni publicité, et le texte est traité dans votre navigateur.' },
        { q: 'Est-ce identique sur tous les téléphones ?', a: 'Sur les appareils récents, presque toujours. Les très anciens peuvent afficher des carrés vides.' },
      ],
    },
    italic: {
      slug: 'generateur-texte-italique-linkedin', label: 'Générateur de texte en italique',
      title: 'Générateur de Texte en Italique pour LinkedIn | LekhKit',
      h1: 'Générateur de texte en italique pour LinkedIn',
      desc: 'Créez du texte en italique pour vos publications et commentaires LinkedIn. Copiez et collez. Gratuit et privé, rien n’est envoyé.',
      intro: 'L’italique apporte un accent discret, une citation ou une remarque en passant. Saisissez votre texte ci-dessous et copiez la version en italique.',
      usesTitle: 'Bons usages de l’italique',
      uses: ['Citations et courtes phrases au milieu d’une histoire.', 'Titres de livres, d’articles ou de podcasts.', 'Une remarque entre parenthèses.', 'Une question finale pour vos lecteurs.'],
      faq: [
        { q: 'Puis-je combiner italique et gras ?', a: 'Oui. Dans l’éditeur complet de LekhKit, vous pouvez utiliser gras, italique, souligné et barré, et les mélanger.' },
        { q: 'Pourquoi faut-il un générateur ?', a: 'Parce que LinkedIn n’accepte que du texte brut dans les publications. Le générateur remplace chaque lettre par son équivalent italique en Unicode.' },
      ],
    },
    strike: {
      slug: 'texte-barre-linkedin', label: 'Texte barré',
      title: 'Texte Barré pour LinkedIn : Générateur Gratuit | LekhKit',
      h1: 'Texte barré pour LinkedIn',
      desc: 'Barrez des mots dans vos publications et commentaires LinkedIn. Générateur gratuit : saisissez, copiez, collez. Fonctionne dans votre navigateur.',
      intro: 'Le texte barré permet d’afficher une correction ou un changement de plan sans effacer les mots d’origine. Saisissez ci-dessous et copiez le texte barré.',
      usesTitle: 'À quoi sert le texte barré',
      uses: ['Avant et après : une ancienne idée barrée, puis la nouvelle.', 'Corriger un chiffre ou une date.', 'Une remarque humoristique.', 'Des listes de choses que vous avez arrêtées.'],
      faq: [
        { q: 'Le trait s’affiche-t-il sur tous les appareils ?', a: 'Sur les appareils récents, oui. L’épaisseur et la hauteur du trait peuvent varier légèrement selon la police.' },
        { q: 'Comment ça fonctionne ?', a: 'On utilise un caractère combinant qui place un petit trait sur chaque lettre. Comme il est attaché au texte normal, il se colle sans problème.' },
      ],
    },
    bullets: {
      slug: 'puces-pour-linkedin', label: 'Puces pour LinkedIn',
      title: 'Puces pour LinkedIn : Copier-Coller des Listes | LekhKit',
      h1: 'Puces et listes pour LinkedIn',
      desc: 'Ajoutez des puces à vos publications LinkedIn. Un élément par ligne, choisissez le symbole et copiez la liste. Gratuit et privé.',
      intro: 'LinkedIn ne transforme pas les tirets en listes. Écrivez un élément par ligne, choisissez un style de puce et copiez une liste propre.',
      usesTitle: 'Conseils pour des listes faciles à lire',
      uses: ['Une idée par ligne, assez courte pour tenir sur une seule ligne.', 'Commencez chaque élément de la même façon, par un verbe par exemple.', 'Laissez une ligne vide avant et après la liste.', 'Cinq à sept éléments suffisent.'],
      faq: [
        { q: 'Pourquoi ne pas utiliser un tiret ?', a: 'Un tiret fonctionne, mais une vraie puce se voit mieux et se lit tout de suite comme une liste.' },
        { q: 'Est-ce que ça marche sur l’appli mobile ?', a: 'Oui. Ce sont des caractères ordinaires, visibles dans l’appli et sur le site LinkedIn.' },
      ],
    },
  },

  /* -------------------------------------------------------------------- German */
  {
    code: 'de', name: 'Deutsch', locale: 'de_DE',
    ui: {
      skip: 'Zum Inhalt springen', home: 'LekhKit', faq: 'Häufige Fragen', related: 'Ähnliche Seiten',
      ctaBefore: 'Schreiben Sie einen ganzen Beitrag?', ctaLink: 'Öffnen Sie den LekhKit-Editor', ctaAfter: 'mit Fett, Kursiv, Listen, Emojis und Vorschau für Desktop und Handy.',
      tools: 'Tools', guides: 'Ratgeber', about: 'LekhKit',
      footerLine: 'Kostenloser Formatierer für LinkedIn-Beiträge. Ihr Text bleibt in Ihrem Browser und wird nie hochgeladen. Nicht mit LinkedIn verbunden.', english: 'English version',
      yourText: 'Ihr Text', oneItem: 'Ein Punkt pro Zeile', copy: 'Kopieren', copied: 'Kopiert', bulletStyle: 'Aufzählungszeichen',
    },
    howTitle: 'So nutzen Sie es auf LinkedIn',
    steps: ['Geben Sie Ihren Text oben ein oder fügen Sie ihn ein.', 'Kopieren Sie das Ergebnis.', 'Fügen Sie es in Ihren Beitrag, Kommentar, Ihre Schlagzeile oder den Info-Bereich bei LinkedIn ein.'],
    whyTitle: 'Warum LinkedIn diese Formatierung nicht hat',
    why: [
      'Das Eingabefeld für LinkedIn-Beiträge akzeptiert nur reinen Text. Deshalb nutzen Tools wie dieses Unicode-Zeichen: Der Standard enthält ganze Alphabete in verschiedenen Stilen, die sich überall einfügen lassen, wo reiner Text erlaubt ist.',
      'Für LinkedIn sind es normale Zeichen, daher bleibt der Stil nach dem Veröffentlichen erhalten. Es ist keine Formatierung wie in einem Textprogramm.',
    ],
    careTitle: 'Vor dem Veröffentlichen',
    care: [
      'Umlaute und ß (ä, ö, ü, ß) haben keine formatierte Variante und bleiben unverändert.',
      'Manche Screenreader lesen diese Zeichen Buchstabe für Buchstabe vor. Nutzen Sie den Stil nur für kurze Wendungen.',
      'Die LinkedIn-Suche erkennt Wörter aus diesen Zeichen womöglich nicht. Lassen Sie Ihre Schlüsselwörter in normalem Text.',
    ],
    bold: {
      slug: 'linkedin-fetter-text-generator', label: 'Generator für fetten Text',
      title: 'Fetten Text für LinkedIn erstellen | LekhKit',
      h1: 'Generator für fetten Text auf LinkedIn',
      desc: 'Schreiben Sie fett auf LinkedIn: Beiträge, Kommentare und Schlagzeile. Kostenlos, ohne Anmeldung, und Ihr Text verlässt den Browser nicht.',
      intro: 'LinkedIn hat in Beiträgen keine Schaltfläche für Fettdruck. Geben Sie unten Ihren Text ein, kopieren Sie die fette Version und fügen Sie sie ein.',
      usesTitle: 'Wann Fettdruck sinnvoll ist',
      uses: ['In der ersten Zeile, damit Leser beim Scrollen anhalten.', 'Bei zwei oder drei Kernaussagen in einem langen Beitrag.', 'Bei den Überschriften einer Schrittliste.', 'Bei einem einzelnen Wort in Ihrer Schlagzeile.'],
      faq: [
        { q: 'Funktioniert es in Kommentaren und Nachrichten?', a: 'Ja. Es sind Textzeichen, daher lassen sie sich in Beiträge, Kommentare, Nachrichten, Schlagzeile und Info-Bereich einfügen.' },
        { q: 'Ist es kostenlos?', a: 'Ja. LekhKit ist kostenlos, ohne Konto und ohne Werbung, und der Text wird in Ihrem Browser verarbeitet.' },
        { q: 'Sieht es auf jedem Handy gleich aus?', a: 'Auf aktuellen Geräten fast immer. Sehr alte Geräte zeigen eventuell leere Kästchen.' },
      ],
    },
    italic: {
      slug: 'linkedin-kursiv-text-generator', label: 'Generator für kursiven Text',
      title: 'Kursiven Text für LinkedIn erstellen | LekhKit',
      h1: 'Generator für kursiven Text auf LinkedIn',
      desc: 'Erstellen Sie kursiven Text für LinkedIn-Beiträge und -Kommentare. Kopieren und einfügen. Kostenlos und privat, nichts wird hochgeladen.',
      intro: 'Kursiv setzt einen leisen Akzent, markiert ein Zitat oder einen Einschub. Geben Sie unten Ihren Text ein und kopieren Sie die kursive Version.',
      usesTitle: 'Gute Einsatzmöglichkeiten für Kursivschrift',
      uses: ['Zitate und kurze Sätze mitten in einer Geschichte.', 'Titel von Büchern, Artikeln oder Podcasts.', 'Ein Einschub in Klammern.', 'Eine abschließende Frage an Ihre Leser.'],
      faq: [
        { q: 'Kann ich Kursiv und Fett kombinieren?', a: 'Ja. Im vollständigen LekhKit-Editor können Sie Fett, Kursiv, Unterstrichen und Durchgestrichen nutzen und mischen.' },
        { q: 'Warum brauche ich einen Generator?', a: 'Weil LinkedIn in Beiträgen nur reinen Text akzeptiert. Der Generator ersetzt jeden Buchstaben durch sein kursives Unicode-Gegenstück.' },
      ],
    },
    strike: {
      slug: 'linkedin-durchgestrichener-text', label: 'Durchgestrichener Text',
      title: 'Durchgestrichener Text für LinkedIn: Kostenlos | LekhKit',
      h1: 'Durchgestrichener Text für LinkedIn',
      desc: 'Streichen Sie Wörter in LinkedIn-Beiträgen und Kommentaren durch. Kostenloser Generator: eingeben, kopieren, einfügen. Läuft im Browser.',
      intro: 'Durchgestrichener Text zeigt eine Korrektur oder eine Planänderung, ohne die ursprünglichen Wörter zu löschen. Geben Sie unten Ihren Text ein und kopieren Sie das Ergebnis.',
      usesTitle: 'Wofür man Durchstreichen nutzt',
      uses: ['Vorher und nachher: eine alte Überzeugung durchgestrichen, danach die neue.', 'Eine Zahl oder ein Datum korrigieren.', 'Eine humorvolle Bemerkung.', 'Listen mit Dingen, die Sie aufgegeben haben.'],
      faq: [
        { q: 'Wird die Linie auf allen Geräten angezeigt?', a: 'Auf aktuellen Geräten ja. Dicke und Höhe der Linie können je nach Schriftart leicht abweichen.' },
        { q: 'Wie funktioniert das?', a: 'Es wird ein kombinierendes Zeichen genutzt, das einen kleinen Strich über jeden Buchstaben legt. Da es am normalen Text hängt, lässt es sich problemlos einfügen.' },
      ],
    },
    bullets: {
      slug: 'linkedin-aufzaehlungszeichen', label: 'Aufzählungszeichen',
      title: 'Aufzählungszeichen für LinkedIn: Listen kopieren | LekhKit',
      h1: 'Aufzählungszeichen und Listen für LinkedIn',
      desc: 'Fügen Sie Ihren LinkedIn-Beiträgen Aufzählungszeichen hinzu. Ein Punkt pro Zeile, Symbol wählen, Liste kopieren. Kostenlos und privat.',
      intro: 'LinkedIn macht aus Bindestrichen keine Listen. Schreiben Sie einen Punkt pro Zeile, wählen Sie ein Aufzählungszeichen und kopieren Sie eine saubere Liste.',
      usesTitle: 'Tipps für gut lesbare Listen',
      uses: ['Ein Gedanke pro Zeile, möglichst in einer einzigen Zeile.', 'Beginnen Sie alle Punkte gleich, zum Beispiel mit einem Verb.', 'Lassen Sie vor und nach der Liste eine Leerzeile.', 'Fünf bis sieben Punkte reichen aus.'],
      faq: [
        { q: 'Warum nicht einfach einen Bindestrich?', a: 'Ein Bindestrich geht, aber ein echtes Aufzählungszeichen fällt mehr auf und wird sofort als Liste erkannt.' },
        { q: 'Klappt das in der mobilen App?', a: 'Ja. Es sind normale Zeichen und sie erscheinen in der App und auf der LinkedIn-Website.' },
      ],
    },
  },

  /* ------------------------------------------------------------------- Italian */
  {
    code: 'it', name: 'Italiano', locale: 'it_IT',
    ui: {
      skip: 'Vai al contenuto', home: 'LekhKit', faq: 'Domande frequenti', related: 'Pagine correlate',
      ctaBefore: 'Stai scrivendo un post completo?', ctaLink: 'Apri l’editor di LekhKit', ctaAfter: 'con grassetto, corsivo, elenchi, emoji e anteprima desktop e mobile.',
      tools: 'Strumenti', guides: 'Guide', about: 'LekhKit',
      footerLine: 'Formattatore gratuito per i post di LinkedIn. Il tuo testo resta nel browser e non viene mai caricato. Non affiliato a LinkedIn.', english: 'English version',
      yourText: 'Il tuo testo', oneItem: 'Un elemento per riga', copy: 'Copia', copied: 'Copiato', bulletStyle: 'Stile dell’elenco',
    },
    howTitle: 'Come usarlo su LinkedIn',
    steps: ['Scrivi o incolla il testo nel riquadro qui sopra.', 'Copia il risultato.', 'Incollalo nel tuo post, commento, titolo o sezione Informazioni di LinkedIn.'],
    whyTitle: 'Perché LinkedIn non ha questa formattazione',
    why: [
      'La casella di pubblicazione di LinkedIn accetta solo testo semplice. Per questo strumenti come questo usano caratteri Unicode: lo standard include alfabeti interi in stili diversi, che si incollano ovunque sia ammesso testo semplice.',
      'Per LinkedIn sono caratteri normali, quindi lo stile resta dopo la pubblicazione. Non è una formattazione come quella di un programma di scrittura.',
    ],
    careTitle: 'Prima di pubblicare',
    care: [
      'Le lettere accentate (à, è, é, ì, ò, ù) non hanno una versione con stile e restano come le scrivi.',
      'Alcuni lettori di schermo leggono questi caratteri lettera per lettera. Usa lo stile solo per frasi brevi.',
      'La ricerca di LinkedIn potrebbe non riconoscere le parole scritte con questi caratteri. Lascia le parole chiave in testo normale.',
    ],
    bold: {
      slug: 'generatore-testo-grassetto-linkedin', label: 'Generatore di testo in grassetto',
      title: 'Generatore di Testo in Grassetto per LinkedIn | LekhKit',
      h1: 'Generatore di testo in grassetto per LinkedIn',
      desc: 'Scrivi in grassetto su LinkedIn: post, commenti e titolo. Gratis, senza registrazione, e il testo non lascia il tuo browser.',
      intro: 'LinkedIn non ha il pulsante grassetto nei post. Scrivi qui sotto, copia il testo in grassetto e incollalo dove vuoi.',
      usesTitle: 'Quando conviene usare il grassetto',
      uses: ['Nella prima riga, per fermare chi scorre il feed.', 'In due o tre frasi chiave di un post lungo.', 'Nei titoletti di un elenco di passaggi.', 'In una sola parola del tuo titolo.'],
      faq: [
        { q: 'Funziona nei commenti e nei messaggi?', a: 'Sì. Sono caratteri di testo, quindi si incollano in post, commenti, messaggi, titolo e Informazioni.' },
        { q: 'È gratis?', a: 'Sì. LekhKit è gratuito, senza account né pubblicità, e il testo viene elaborato nel tuo browser.' },
        { q: 'Si vede uguale su tutti i telefoni?', a: 'Sui dispositivi attuali quasi sempre. Quelli molto vecchi possono mostrare quadratini vuoti.' },
      ],
    },
    italic: {
      slug: 'generatore-testo-corsivo-linkedin', label: 'Generatore di testo in corsivo',
      title: 'Generatore di Testo in Corsivo per LinkedIn | LekhKit',
      h1: 'Generatore di testo in corsivo per LinkedIn',
      desc: 'Crea testo in corsivo per post e commenti di LinkedIn. Copia e incolla. Gratis e privato, non viene caricato nulla.',
      intro: 'Il corsivo dà un’enfasi discreta, evidenzia una citazione o una battuta a margine. Scrivi qui sotto e copia la versione in corsivo.',
      usesTitle: 'Buoni usi del corsivo',
      uses: ['Citazioni e brevi frasi nel mezzo di una storia.', 'Titoli di libri, articoli o podcast.', 'Un inciso tra parentesi.', 'Una domanda finale per i lettori.'],
      faq: [
        { q: 'Posso unire corsivo e grassetto?', a: 'Sì. Nell’editor completo di LekhKit puoi usare grassetto, corsivo, sottolineato e barrato, e mescolarli.' },
        { q: 'Perché serve un generatore?', a: 'Perché LinkedIn accetta solo testo semplice nei post. Il generatore sostituisce ogni lettera con l’equivalente corsivo di Unicode.' },
      ],
    },
    strike: {
      slug: 'testo-barrato-linkedin', label: 'Testo barrato',
      title: 'Testo Barrato per LinkedIn: Generatore Gratis | LekhKit',
      h1: 'Testo barrato per LinkedIn',
      desc: 'Barra le parole nei post e nei commenti di LinkedIn. Generatore gratuito: scrivi, copia, incolla. Funziona nel tuo browser.',
      intro: 'Il testo barrato mostra una correzione o un cambio di programma senza cancellare le parole originali. Scrivi qui sotto e copia il testo barrato.',
      usesTitle: 'A cosa serve il testo barrato',
      uses: ['Prima e dopo: un’idea vecchia barrata e poi quella nuova.', 'Correggere un numero o una data.', 'Una battuta ironica.', 'Elenchi di cose che hai smesso di fare.'],
      faq: [
        { q: 'La riga si vede su tutti i dispositivi?', a: 'Su quelli attuali sì. Spessore e altezza della riga possono variare un po’ a seconda del carattere.' },
        { q: 'Come funziona?', a: 'Si usa un carattere combinante che aggiunge un piccolo tratto su ogni lettera. Essendo legato al testo normale, si incolla senza problemi.' },
      ],
    },
    bullets: {
      slug: 'elenchi-puntati-linkedin', label: 'Elenchi puntati per LinkedIn',
      title: 'Elenchi Puntati per LinkedIn: Copia e Incolla | LekhKit',
      h1: 'Elenchi puntati per LinkedIn',
      desc: 'Aggiungi elenchi puntati ai tuoi post di LinkedIn. Un elemento per riga, scegli il simbolo e copia l’elenco. Gratis e privato.',
      intro: 'LinkedIn non trasforma i trattini in elenchi. Scrivi un elemento per riga, scegli uno stile di punto elenco e copia un elenco pulito.',
      usesTitle: 'Consigli per elenchi facili da leggere',
      uses: ['Un’idea per riga, e che stia in una riga sola.', 'Inizia tutti gli elementi allo stesso modo, per esempio con un verbo.', 'Lascia una riga vuota prima e dopo l’elenco.', 'Da cinque a sette elementi bastano.'],
      faq: [
        { q: 'Perché non usare un trattino?', a: 'Il trattino funziona, ma un vero punto elenco si nota di più e si riconosce subito come elenco.' },
        { q: 'Funziona nell’app per telefono?', a: 'Sì. Sono caratteri normali e si vedono nell’app e sul sito di LinkedIn.' },
      ],
    },
  },

  /* ---------------------------------------------------------------- Indonesian */
  {
    code: 'id', name: 'Bahasa Indonesia', locale: 'id_ID',
    ui: {
      skip: 'Lompat ke konten', home: 'LekhKit', faq: 'Pertanyaan umum', related: 'Terkait',
      ctaBefore: 'Mau menulis postingan lengkap?', ctaLink: 'Buka editor LekhKit', ctaAfter: 'dengan teks tebal, miring, daftar, emoji, dan pratinjau desktop serta ponsel.',
      tools: 'Alat', guides: 'Panduan', about: 'LekhKit',
      footerLine: 'Pemformat postingan LinkedIn gratis. Teks Anda tetap di browser dan tidak pernah diunggah. Tidak berafiliasi dengan LinkedIn.', english: 'English version',
      yourText: 'Teks Anda', oneItem: 'Satu poin per baris', copy: 'Salin', copied: 'Tersalin', bulletStyle: 'Gaya poin',
    },
    howTitle: 'Cara memakainya di LinkedIn',
    steps: ['Ketik atau tempel teks Anda di kotak di atas.', 'Salin hasilnya.', 'Tempel ke postingan, komentar, judul profil, atau bagian Tentang di LinkedIn.'],
    whyTitle: 'Mengapa LinkedIn tidak punya format ini',
    why: [
      'Kotak postingan LinkedIn hanya menerima teks biasa. Karena itu alat seperti ini memakai karakter Unicode: standar tersebut memuat seluruh alfabet dengan gaya berbeda, dan bisa ditempel di mana pun teks biasa diizinkan.',
      'Bagi LinkedIn, ini karakter biasa, sehingga gayanya tetap ada setelah diposting. Ini bukan pemformatan seperti di aplikasi pengolah kata.',
    ],
    careTitle: 'Sebelum memposting',
    care: [
      'Hanya huruf A–Z dan angka yang punya versi bergaya. Karakter lain tetap seperti yang Anda ketik.',
      'Sebagian pembaca layar membaca karakter ini huruf demi huruf. Pakai gaya hanya untuk frasa pendek.',
      'Pencarian LinkedIn mungkin tidak mengenali kata yang ditulis dengan karakter ini. Biarkan kata kunci tetap berupa teks biasa.',
    ],
    bold: {
      slug: 'generator-teks-tebal-linkedin', label: 'Generator teks tebal',
      title: 'Generator Teks Tebal untuk LinkedIn | LekhKit',
      h1: 'Generator teks tebal untuk LinkedIn',
      desc: 'Tulis teks tebal di LinkedIn: postingan, komentar, dan judul profil. Gratis, tanpa daftar, dan teks Anda tidak keluar dari browser.',
      intro: 'LinkedIn tidak punya tombol tebal di postingan. Ketik di bawah, salin teks tebalnya, lalu tempel ke mana saja.',
      usesTitle: 'Kapan teks tebal berguna',
      uses: ['Di baris pertama, agar orang berhenti menggulir.', 'Pada dua atau tiga frasa kunci dalam postingan panjang.', 'Pada judul poin di daftar langkah.', 'Pada satu kata di judul profil Anda.'],
      faq: [
        { q: 'Apakah bisa dipakai di komentar dan pesan?', a: 'Bisa. Ini karakter teks, jadi bisa ditempel di postingan, komentar, pesan, judul profil, dan bagian Tentang.' },
        { q: 'Apakah gratis?', a: 'Ya. LekhKit gratis, tanpa akun dan tanpa iklan, dan teks diproses di browser Anda.' },
        { q: 'Apakah tampil sama di semua ponsel?', a: 'Di perangkat masa kini hampir selalu. Perangkat yang sangat lama bisa menampilkan kotak kosong.' },
      ],
    },
    italic: {
      slug: 'generator-teks-miring-linkedin', label: 'Generator teks miring',
      title: 'Generator Teks Miring untuk LinkedIn | LekhKit',
      h1: 'Generator teks miring untuk LinkedIn',
      desc: 'Buat teks miring untuk postingan dan komentar LinkedIn. Salin dan tempel. Gratis dan privat, tidak ada yang diunggah.',
      intro: 'Teks miring memberi penekanan halus, menandai kutipan, atau catatan sampingan. Ketik di bawah dan salin versi miringnya.',
      usesTitle: 'Penggunaan teks miring yang baik',
      uses: ['Kutipan dan kalimat pendek di tengah cerita.', 'Judul buku, artikel, atau podcast.', 'Catatan sampingan dalam tanda kurung.', 'Pertanyaan penutup untuk pembaca.'],
      faq: [
        { q: 'Bisakah teks miring digabung dengan tebal?', a: 'Bisa. Di editor lengkap LekhKit Anda dapat memakai tebal, miring, garis bawah, dan coret, lalu mencampurnya.' },
        { q: 'Mengapa perlu generator?', a: 'Karena LinkedIn hanya menerima teks biasa di postingan. Generator mengganti setiap huruf dengan padanan miringnya di Unicode.' },
      ],
    },
    strike: {
      slug: 'teks-coret-linkedin', label: 'Teks coret',
      title: 'Teks Coret untuk LinkedIn: Generator Gratis | LekhKit',
      h1: 'Teks coret untuk LinkedIn',
      desc: 'Coret kata di postingan dan komentar LinkedIn. Generator gratis: ketik, salin, tempel. Berjalan di browser Anda.',
      intro: 'Teks coret menunjukkan koreksi atau perubahan rencana tanpa menghapus kata aslinya. Ketik di bawah dan salin teks yang tercoret.',
      usesTitle: 'Untuk apa teks coret dipakai',
      uses: ['Sebelum dan sesudah: pendapat lama dicoret, lalu yang baru.', 'Mengoreksi angka atau tanggal.', 'Komentar bernada jenaka.', 'Daftar hal yang sudah tidak Anda lakukan.'],
      faq: [
        { q: 'Apakah garisnya tampil di semua perangkat?', a: 'Di perangkat masa kini, ya. Ketebalan dan tinggi garis bisa sedikit berbeda tergantung fontnya.' },
        { q: 'Bagaimana cara kerjanya?', a: 'Memakai karakter gabungan yang menaruh garis kecil di atas setiap huruf. Karena menempel pada teks biasa, mudah ditempel.' },
      ],
    },
    bullets: {
      slug: 'poin-poin-linkedin', label: 'Poin-poin untuk LinkedIn',
      title: 'Poin-Poin untuk LinkedIn: Salin dan Tempel Daftar | LekhKit',
      h1: 'Poin-poin dan daftar untuk LinkedIn',
      desc: 'Tambahkan poin-poin ke postingan LinkedIn Anda. Satu poin per baris, pilih simbol, lalu salin daftarnya. Gratis dan privat.',
      intro: 'LinkedIn tidak mengubah tanda hubung menjadi daftar. Tulis satu poin per baris, pilih gaya, dan salin daftar yang rapi.',
      usesTitle: 'Tips daftar yang mudah dibaca',
      uses: ['Satu gagasan per baris, usahakan muat dalam satu baris.', 'Mulai setiap poin dengan cara yang sama, misalnya dengan kata kerja.', 'Beri baris kosong sebelum dan sesudah daftar.', 'Lima sampai tujuh poin sudah cukup.'],
      faq: [
        { q: 'Mengapa tidak pakai tanda hubung saja?', a: 'Tanda hubung bisa, tetapi simbol poin yang sebenarnya lebih terlihat dan langsung dikenali sebagai daftar.' },
        { q: 'Apakah berfungsi di aplikasi ponsel?', a: 'Ya. Ini karakter biasa dan tampil di aplikasi maupun situs LinkedIn.' },
      ],
    },
  },
];

export const LANGS = PACKS.map((p) => ({ code: p.code, name: p.name, locale: p.locale }));
export const UI: Record<string, LangUi> = Object.fromEntries(PACKS.map((p) => [p.code, p.ui]));

const UPDATED = '2026-11-08';
const KINDS: { key: 'bold' | 'italic' | 'strike' | 'bullets'; mode: Mode; group: string }[] = [
  { key: 'bold', mode: 'bold', group: 'bold' },
  { key: 'italic', mode: 'italic', group: 'italic' },
  { key: 'strike', mode: 'strike', group: 'strike' },
  { key: 'bullets', mode: 'bullets', group: 'bullets' },
];

function buildLangPages(): SeoPage[] {
  const out: SeoPage[] = [];
  for (const pk of PACKS) {
    for (const k of KINDS) {
      const t = pk[k.key];
      out.push({
        slug: t.slug,
        lang: pk.code,
        group: k.group,
        kind: 'tool',
        title: t.title,
        h1: t.h1,
        description: t.desc,
        label: t.label,
        intro: t.intro,
        mode: k.mode,
        sections: [
          { h2: pk.howTitle, ordered: true, list: pk.steps },
          { h2: t.usesTitle, list: t.uses },
          { h2: pk.whyTitle, paras: pk.why },
          { h2: pk.careTitle, list: pk.care },
        ],
        faq: t.faq,
        related: KINDS.filter((o) => o.key !== k.key).map((o) => pk[o.key].slug),
        updated: UPDATED,
      });
    }
  }
  return out;
}

export const INTL_PAGES: SeoPage[] = buildLangPages();
export const intlPage = (lang: string, slug: string) => INTL_PAGES.find((p) => p.lang === lang && p.slug === slug);
export const intlPagesFor = (lang: string) => INTL_PAGES.filter((p) => p.lang === lang);
