/*
  Hier die Inhalte der 24 Türchen eintragen.

  VIDEO:
  { day: 1, type: "video", title: "Titel", videoId: "YOUTUBE_VIDEO_ID", message: "Optionaler Text" }

  LINK:
  { day: 2, type: "link", title: "Titel", buttonText: "Hier öffnen", url: "https://example.com", message: "Optionaler Text" }

  FUN FACT:
  { day: 3, type: "fact", title: "Schon gewusst?", fact: "Hier steht dein Fun Fact." }

  "message" ist bei allen drei Typen optional.
*/
const adventVideos = [
  {
    day: 1,
    type: "video",
    title: "Jesus, es ist schon Dezember",
    videoId: "8w_wcJHRzck",
    message: "Im Advent geht es ja bekanntlich um Jesus. Hier ein kleiner Fun Fact (ich hab den Verdacht den kennst du) über die Hood des guten Mannes :)"
  },
  {
    day: 2,
    type: "video",
    title: "(ugly christmas) sweater weather",
    videoId: "EImnSsCadK8",
    message: "Langsam kann man den ugly christmas sweater rausholen. Oder, wenn man cool ist (und drüber steht was Gen-Z von einen denkt), kann man auch in einem rabbithole über Strick- und Häkelmaschinen verschwinden. Sehr zu empfehlen für einen noch deeperen deep-dive ist auch die Netflix-Explained Doku über athleisurewear."
  },
  {
    day: 3,
    type: "fact",
    title: "Wusstest du dass..",
    fact: "An genau diesem Tag, im Jahr 1992 wurde die allererste SMS mit dem Text 'Merry Christmas' verschickt. Un im Jahr 1967 wurde die erste Herztransplantation an einem Menschen durchgeführt."
  },
  { day: 4, type: "video", title: "asdfghjkl", videoId: "mFkC3F0lmjA", message: "Du fragst sich sicherlich jedes Mal beim Verfassen einer großartigen E-Mail, wer sich eigentlich diese QWERTZ-Tastatur überlegt hat und warum. Falls du es noch nicht recherchiert hast, hat es glücklicherweise schon jemand für dich gemacht." },
 {
    day: 5,
    type: "fact",
    title: "Die Zahl 5 schreit nach einem meiner liebste Mathe-Witze. (Es hat leider noch nie jemand ernsthaft drüber gelacht, aber ich probiers trotzdem)",
    fact: "Löse mit Bedacht: 230 - 220 * 0.5 = ? - Du wirst es nicht glauben, aber die Antwort ist 5!"
  },
  { day: 6, type: "video", title: "conspiracy time", videoId: "d0Fbcc8uWEc", message: "Der heilige Nikolaus von Myra lebte bis 286 - also vor 1740 Jahren. Aber waren es wirklich so viele? Zeit für eine meiner liebsten Verschwörungstheorien." },
  { day: 7, type: "video", title: "whiskey tango foxtrott", videoId: "", message: "Heute im Jahr 1944 würde die ICAO gegründet. Juhu das schreit nach einem Video über Flugzeuge!" },
  { day: 8, type: "video", title: "chatty oder chat?", videoId: "", message: "Heute vor 11 Jahren wurde Open AI gegründet. Jetzt hatte zu diesem Anlass die Wahl zwischen einem weirden AI Video zum Techno-Remix von Jingle-Bells oder Statistik Content zu LLMs." },
   {
    day: 9,
    type: "link",
    title: "(ugly christmas) sweater weather",
    buttonText: "Langsam kann man de.",
    url: "https://example.com",
    message: "Ich habe etwas für dich."
  },
  { day: 10, type: "video", title: "strike", videoId: "", message: "wie man so schön sagt wenn man beim bowling alle 10 trifft. Wenn das nicht nach einem Video über Bowlingkugeln schreit weiß ich auch nicht." },
  { day: 11, type: "video", title: "einen wunderschönen Tag des Berges", videoId: "", message: "Nepal steht schon länger auf meiner Liste, und ebenso das angrenzende Bhutan - das Land mit dem Bruttonationalglück. Und einem wirklich wirklich spannenden Flughafen." },
  { day: 12, type: "video", title: "Willkommen im Club, alter Mann", videoId: "KtT_cgMzHx8", message: "Jetzt hast du sie gekackt, die magische Zahl und bist offiziell alt. Siebträger und Airfryer sind schon im Gepäck - kommt nun der Sauerteig-Staerter, der Hyrox oder doch das Rennrad - choose wisely würde ich sagen. Was auf keinen Fall fehlen darf, ist ein wenig Geburtstagsmathe :)" },
  { day: 13, type: "video", title: "wunderschönen Tag der Republik Malta!", videoId: "8gYDjWUefI4", message: "Muss man nicht viel mehr dazu sagen. Aber kennst du auch das andere Malta?" },
  { day: 14, type: "video", title: "Türchen 14", videoId: "", message: "" },
  { day: 15, type: "video", title: "Türchen 15", videoId: "", message: "" },
  { day: 16, type: "video", title: "Türchen 16", videoId: "", message: "" },
  { day: 17, type: "video", title: "ready for takeoff", videoId: "", message: "Heute feiern wir das jubiläum des ersten fluges der brüder wright im Jahr 1903. So viele Flugzeug-spezifische Jubiläen, was mach ich nur damit?" },
  { day: 18, type: "video", title: "Türchen 18", videoId: "", message: "" },
  { day: 19, type: "video", title: "urlaubsreif", videoId: "0fWFYp0wB6w", message: "Als Optimierungsenthusiast stellt man sich natürlich die Frage, gibt es ein mathematisch perfektes Urlaubsziel?" },
  { day: 20, type: "video", title: "Türchen 20", videoId: "", message: "" },
  { day: 21, type: "video", title: "wohin die Zeit verfliegt..", videoId: "", message: "" },
  { day: 22, type: "video", title: "Türchen 22", videoId: "", message: "" },
  { day: 23, type: "video", title: "ready?", videoId: "", message: "Man munkelt es gibt Menschen die sich nicht Monate im vorhinein Gedanken über Geschenke machen. Glücklicherweise haben sich die Menschen bei amazon sehr sehr viele Gedanken gemacht. Ich wollte übrigens schon immer mal nach Alaska." },
  { day: 24, type: "video", title: "Wunder des Lebens, oder so", videoId: "", message: "Wenn eine Geburt einen jahrtausende andauernden Kult auslöst, dann fragt man sich selbstverständlich, ob dieser Kult Wunder denn genau definiert hat und was genau der Prozess hinter der Klassifizierung eines solchen ist." }
];
