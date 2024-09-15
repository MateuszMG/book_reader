"use client";

import { useEffect, useState } from "react";
import { Button, Typography, Spin } from "antd";
import axios from "axios";

const { Paragraph } = Typography;

//  currentChunk
//  nextChunk
//  currentSpeaking

const TextToSpeechComponent = () => {
  const [selectedBook, setSelectedBook] = useState<string | undefined>("Psych");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSentences, setCurrentSentences] = useState<string[]>([]);
  // const [currentChunk, setCurrentChunk] = useState<string[]>([]);
  const [nextChunk, setNextChunk] = useState<string>("");

  const handleNext = async () => {
    // setCurrentChunk(nextChunk);
    // setNextChunk("");

    const sentences = nextChunk
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
      .split("|");
    setCurrentSentences(sentences);

    const res = await axios.post("/api/book", { bookTitle: selectedBook });
    const data = res.data as PostBookResponse;
    // setCurrentChunk(data.currentChunk);
    // setNextChunk(data.nextChunk);

    setNextChunk(data.nextChunk);
    startSpeaking();
    // return nextChunk;
  };

  const fetchChunk = async () => {
    // setLoading(true);
    try {
      const res = await axios.get<GetBookResponse>("/api/book", {
        params: { bookTitle: selectedBook },
      });
      const data = res.data;
      const sentences = data.currentChunk
        .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
        .split("|");
      setCurrentSentences(sentences);
      setNextChunk(data.nextChunk);
    } catch (error) {
      console.error("Error fetching book chunk:", error);
    } finally {
      // setLoading(false);
    }
  };

  const speakSentence = (sentence: string, index: number) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 1.3;
    utterance.voice = window.speechSynthesis
      .getVoices()
      .find(
        (voice) =>
          voice.lang === "pl" ||
          voice.name.toLowerCase().includes("pl") ||
          voice.name.toLowerCase().includes("zosia")
      )!;

    utterance.onend = () => {
      const nextIndex = index + 1;
      if (nextIndex < currentSentences.length) {
        setCurrentSentenceIndex(nextIndex);
        speakSentence(currentSentences[nextIndex], nextIndex);
      } else if (nextChunk) {
        setCurrentSentences([]);
        setCurrentSentenceIndex(0);
        // fetchNextChunk();
        handleNext().then();
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  // const fetchNextChunk = () => {
  //   const sentences =
  //     nextChunk?.replace(/([.!?])\s*(?=[A-Z])/g, "$1|").split("|") || [];
  //   setCurrentSentences(sentences);
  //   fetchChunk();
  // };

  const startSpeaking = () => {
    if (currentSentences.length > 0) {
      speakSentence(currentSentences[0], 0);
    }
  };

  useEffect(() => {
    fetchChunk();
  }, []);

  console.log("currentSentences", currentSentences);

  return (
    <div>
      <Button type="primary" onClick={startSpeaking} disabled={loading}>
        {loading ? <Spin /> : "Start Speaking"}
      </Button>
      <div>
        {currentSentences.map((sentence, index) => (
          <Paragraph
            key={index}
            style={{
              backgroundColor:
                index === currentSentenceIndex ? "#d3adf7" : "transparent",
            }}
          >
            {sentence}
          </Paragraph>
        ))}
      </div>
    </div>
  );
};

export default TextToSpeechComponent;

// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Button, Input } from "antd";

// const { TextArea } = Input;

// const text = `
// • Jak mogę sprawić, aby moje małżeństwo znów było dla mnie fascynujące?
// • Jak powstrzymać moje dwuletnie dziecko od napadów krzyku i płaczu?
// • Jak działa umysł? Równie istotne jest „co?”:
// • Co to są emocje?
// • Co oznacza choroba psychiczna?
// • Co naprawdę znaczy słowo „inteligencja”?
// Te właśnie pytania — „jak?”, „co?” i „dlaczego?” — tworzą intelektualne i filozoficzne podstawy psychologii.
// Z tego też powodu sama psychologia może zostać zdefiniowana jako naukowe badanie ludzkiego zachowania i procesów umysłowych. Ta dziedzina stara się więc odkryć, co robimy i jak oraz dlaczego tak właśnie się zachowujemy.
// Tworzenie osoby
// Kiedy usiłuję wyobrazić sobie wszystkie powody, dla jakich ludzie robią to, co robią, i zrozumieć zachowania oraz leżące u ich podstaw procesy umysłowe, na ogół stosuję podejście, które nazywam „zabawą w szalonego naukowca”. Jego celem jest stworzenie danej osoby. Oczywiście nie chodzi tu o dosłowne powołanie do życia człowieka metodą doktora Frankensteina. Mam raczej na myśli nakreślenie względnie dokładnego schematu umysłu i sposobu bycia konkretnej osoby.
// Kiedy w trakcie sesji terapeutycznej klient opisuje mi jedno ze swoich zachowań, zwykle proszę o pokazanie mi tego. Na przykład słyszę o tym, że dziecko pacjenta uderza rodzica, gdy ten każe mu

// coś zrobić. W takiej sytuacji mówię: „Proszę przywołać ten stan. Proszę pokazać mi, jak to wygląda”. W większości przypadków napotykam zagubione spojrzenie klienta, niemającego pojęcia, o co mi właściwie chodzi.
// Moje pytanie ma jednak cel. Zakładam bowiem, że jeżeli ktoś potrafi sprawić, że będzie czuć się w pewien sposób, może również pozbyć się danego uczucia. To zaś oznacza, że ta osoba rozumie, co i dlaczego się z nią dzieje. Jest to swego rodzaju inżynieria wsteczna zastosowana w odniesieniu do psychologii i ułatwiająca zrozumienie ludzkiego działania.
// Końcowa faza rozwoju mojej dziedziny jest dla mnie etapem, na którym możliwe będzie stworzenie kompletnego katalogu komponentów umysłu człowieka i przyczyn wszystkich zachowań. Niewykluczone, że uda się to dzięki opisanemu wcześniej mechanizmowi inżynierii wstecznej. A może przynajmniej naukowcy będą w stanie wykorzystać całą posiadaną wiedzę psychologiczną do stworzenia algorytmu modelującego ludzkie zachowanie. Dzięki temu sztuczna inteligencja byłaby w stanie odtworzyć nasz sposób myślenia i działania na długo po tym, jak przestalibyśmy istnieć. Wspominałem już o szalonych naukowcach, prawda?
// Właśnie tego rodzaju schematy ludzkiego zachowania stanowią dla mnie istotę psychologii. W pracy koncentruję się bowiem przede wszystkim na częściach składowych psychiki (myślach, emocjach, spostrzeżeniach, snach, lękach, osobowości, mózgu) oraz ich funkcjach. Nie jestem w tym podejściu odosobniony — wielu innych psychologów zajmuje się inżynierią wsteczną umysłu i zachowania.
// Odkrywanie funkcji
// Pierwsza zasada leżąca u podstaw mojej wizji psychologii brzmi: zbudowanie modelu umysłu danej osoby staje się możliwe po ustaleniu tego, jaka jest jej funkcja, podobnie jak w przypadku

// inżynierów, którzy są w stanie zaprojektować urządzenie dopiero wtedy, gdy zdecydują, do czego ma ono służyć.
// Jaka jest zatem funkcja (czyli przeznaczenie) istoty ludzkiej?
// Podobnie jak wszystkie organizmy żywe oparte na węglu, ludzie są urządzeniami zaprogramowanymi na przetrwanie. Nie twierdzę, rzecz jasna, że samo życie nie ma sensu. Wręcz przeciwnie, moim zdaniem jego cel to nie tylko mechaniczna egzystencja, ale także przeżywanie go w każdym możliwym aspekcie. Jaki jest zaś sens życia? Cóż, jeżeli chcesz się tego dowiedzieć, obawiam się, że czytasz niewłaściwą książkę. Na takie pytanie odpowiedzi dostarczy Ci raczej Filozofia dla bystrzaków bądź Religia dla bystrzaków.
// Psychologia zajmuje się przede wszystkim dostarczaniem odpowiedzi na pytanie, „jak” się żyje, czyli jakie mechanizmy decydują o życiu, przeżywaniu i przekazywaniu życia.
// Lista części
// Zastanów się teraz nad tym, co z punktu widzenia psychologa jest konieczne do wspomnianego przeżywania i przekazywania życia. Proponuję zacząć, podobnie jak w przypadku większości instrukcji technicznych, od wymienienia wszystkich niezbędnych części.
// Współczesna psychologia opracowała dość szczegółową listę takich elementów:
// Ciało (i wszystkie jego podukłady — patrz rozdział 3.):
// • mózg;
// • serce;
// • hormony;
// • geny;
// • umiejętności motoryczne.

// Umysł (i jego części składowe — patrz rozdziały 4. – 8.): • świadomość;
// • wrażenia, spostrzeżenia, wzrok, smak, węch, słuch, dotyk, równowaga i ból;
// • myślenie, czyli m.in.: uwaga, pamięć, tworzenie koncepcji, rozwiązywanie problemów, podejmowanie decyzji oraz inteligencja;
// • komunikacja, czyli werbalne i niewerbalne wyrażenia, na przykład: język ciała, gestyka, mowa i język;
// • motywacje;
// • emocje.
// Osobowość (patrz rozdział 9.).
// Płeć i seksualność (patrz darmowy artykuł Exploring Human Differences: Culture, Gender and Sexuality) na stronie www.dummies.com/extras/psychology).
// Umiejętności społeczne i nawiązywanie relacji (patrz rozdziały 10. i 11.).
// Podobnie jak w przypadku składania biurka z IKEI, stworzenie listy potrzebnych nam elementów jest zdecydowanie łatwiejsze na papierze niż w rzeczywistości. Psychologowie wciąż pracują nad lepszym zrozumieniem wszystkich składników, zarówno z osobna, jak i w większych układach. Badania takie stanowią podstawę rozwoju nauk społecznych.
// Rozwiązywanie problemów
// Wyobraź sobie, że w jakiś sposób udało nam się stworzyć ludzką istotę i uruchomić ją, tak aby zaczęła samodzielnie zajmować się

// życiem. Załóżmy, że wyposażyliśmy ją we wszystko, co jest do tego potrzebne, zgodnie z najlepszą wiedzą.
// W pewnym momencie zaszła jednak jakaś nieoczekiwana zmiana i nasza istota ludzka zaczyna błądzić i zmagać się z przeciwnościami, które grożą zakończeniem jej funkcjonowania. No tak, zapomnieliśmy o tym, że świat nieustannie ewoluuje.
// Nasz człowiek powinien radzić sobie z otoczeniem, które daje się przewidzieć. Musimy zatem wrócić do warsztatu i wprowadzić do umysłu istoty ludzkiej kolejne programy, a mianowicie:
// • naukę — zdolność do wyciągania wniosków z otoczenia;
// • kontekst — umiejętność rozwoju w reakcji na zmiany
// otoczenia;
// • adaptację — zdolność do radzenia sobie ze zmianą, stresem i chorobami.
// Ludzie potrzebują części i procedur. Nikt nie powiedział, że będzie łatwo.
// Szukanie fachowej pomocy
// Czasami bywa i tak, że człowiek, pomimo posiadania wszystkich potrzebnych części i programów pozwalających mu na samodzielne, sprawne funkcjonowanie, napotyka na swojej drodze problemy, z którymi nie może sobie do końca poradzić. Wtedy na scenę wkraczają lekarze, psychoterapeuci, doradcy, pracownicy społeczni, nauczyciele i konsultanci.
// Wspomniani specjaliści posługują się wieloma różnymi narzędziami i procedurami, które pozwalają na diagnozowanie i rozwiązywanie problemów. Są to m.in.:
// • Diagnostyka — jest ona szczególnie ważna w psychopatologii (patrz rozdział 13.) oraz przy testach

// psychologicznych (rozdział 14.).
// • Terapie biomedyczne — leczenie pewnych zaburzeń psychicznych może wymagać terapii farmakologicznej i zabiegów fizycznych (patrz rozdział 3.).
// • Terapia oraz interwencja psychologiczna — psychoanaliza, terapia poznawczo-behawioralna i humanistyczna (patrz rozdziały 15. – 18.).
// • Psychologia stosowana — stosowanie wiedzy psychologicznej do rozwiązywania wielu różnych problemów (patrz artykuł Applying Psychology for a Better World na stronie www.dummies.com/extras/psychology).
// Działanie praktyczne
// Psychologia to naukowe studium ludzkiego zachowania i procesów umysłowych. Na wszelki wypadek nadmienię jeszcze raz, że nie planuję brać udziału w żadnym projekcie polegającym na faktycznym budowaniu nowego człowieka. Staram się jedynie stworzyć schemat, który mógłby pomóc komuś, kto chciałby kiedyś podjąć się takiej pracy. W niniejszej książce opisuję zaś każdy z elementów składających się na umysł i zachowanie człowieka.
// Psychologia była początkowo pewnym rodzajem filozofii, a więc na ogół indywidualnym, spekulatywnym i teoretycznym sposobem myślenia o ludziach. Dzięki ogromnej pracy takich osób, jak William James, Wilhelm Wundt, Edward Thorndike, B.F. Skinner, Albert Bandura, Jean Piaget, Pillip Zimbardo, Robert Sternberg, Albert Ellis i wielu, wielu innych naukowców, którzy przez ostatnie 100 lat prowadzili badania nad umysłem człowieka, ta subiektywna dziedzina została przekształcona w stosunkowo obiektywną gałąź wiedzy. Stosowane w pracy psychologicznej narzędzia, eksperymenty i metody analizy statystycznej są z każdym rokiem coraz bardziej złożone.

// Dzięki wykorzystaniu nowoczesnych technologii, na przykład elektroencefalogramu lub rezonansu magnetycznego, wspomniana nauka ewoluowała od czysto teoretycznych rozważań nad naturą ludzką do dziedziny badań nad konkretnymi, namacalnymi zjawiskami, takimi jak działanie neuronów lub analiza wyników testów.
// Psychologia nieustannie się rozwija, dzięki czemu zajmujące się nią osoby zyskują coraz lepszy wgląd w to, jak otoczenie i różnice międzyludzkie (na przykład pochodzenie, płeć i orientacja seksualna) wpływają na umysł i zachowanie.

// Rozdział 2.
// Sens ludzkiego działania — podstawy psychologii
// W tym rozdziale:
// • Zrozumiemy siebie.
// • Wykorzystamy odrobinę psychologii popularnej.
// • Uporządkujemy wiedzę.
// • Wyjaśnimy efekt placebo.
// W pewnym sensie każdy z nas jest domorosłym psychologiem. Zawodowcy nie są jedynymi ludźmi, którzy starają się zrozumieć innych. Kiedy zacząłem studiować psychologię, miałem już pewne wyobrażenie o człowieku. Czasami zgadzałem się z teoriami Freuda i innych badaczy, czasami zaś zaprzeczałem im całym sercem. Z całą pewnością nie jestem w tym odosobniony. Większość z nas ma własne pomysły dotyczące tego, dlaczego ludzie zachowują się w taki, a nie inny sposób.
// Jedną z miłych cech psychologii jest to, że w odróżnieniu od chemii czy astronomii wspomniana dziedzina zajmuje się tym, z czym wszyscy mamy do czynienia na co dzień, a mianowicie naturą człowieka. Jasne, codziennie stykamy się z substancjami chemicznymi, ale nie przypominam sobie, aby ktoś zapytał mnie kiedyś: „Jak oni to zrobili, że ten płyn do płukania ust ma miętowy smak?”.

// Domorosłych psychologów najłatwiej znaleźć w lokalnej kawiarni, gdzie większość siedzących przy stolikach osób rozmawia na temat tego, jak zachowują się pewni ludzie i co ich do tego skłania. Zewsząd słychać coś w rodzaju: „A wtedy mu powiedziałam...”, „Nie, powinnaś była raczej powiedzieć...”. Czasami przypomina to zebrania dużych grup terapeutycznych. Wszyscy często usilnie pracujemy nad tym, aby rozgryźć innych.
// Psychologowie nazywają czasami takie zachowanie psychologią ludową, określaną jako zbiór zasad wykorzystywanych przez zwykłych ludzi w celu zrozumienia, wyjaśnienia i przewidywania postępowania zarówno ich samych, jak i innych osób. W praktyce stosujemy bowiem pewne psychologiczne idee i teorie, aby pojąć stany, cechy osobowości czy okoliczności towarzyszące zachowaniom poszczególnych jednostek. Najczęściej sięgamy przy tym do dwóch koncepcji: poglądów i pragnień. Wszyscy wierzymy, że ludzie posiadają konkretne poglądy, którym podporządkowują swoje działania. Dlaczego więc robią to, co robią? Ponieważ mają takie, a nie inne poglądy.
// Kiedy praktykujemy ludową psychologię, zakładamy, że zachowania warunkowane są myślami oraz innymi procesami umysłowymi, czyli właśnie poglądami oraz pragnieniami. Oczywiście domorośli psychologowie nie ograniczają swoich narzędzi do wspomnianej metody, często wyjaśniającej postępowanie człowieka w kategoriach szczęścia, klątwy, błogosławieństwa, karmy, przeznaczenia i wielu innych niespecjalistycznych terminów. Nie chcę jednak stawiać jej w złym świetle, ponieważ specjalista naprawdę ma kłopot z wytłumaczeniem, jak to się dzieje, że dana osoba wygrywa na loterii. Dużo łatwiejsze jest jednak wyjaśnienie, dlaczego ktoś, kto ciągle przegrywa, mimo wszystko nie przestaje kupować losów.
// W niniejszym rozdziale przyjrzymy się temu, w jaki sposób funkcjonują ludzie. Odwołamy się przy tym do teorii rodzących
// `;

// const TextToSpeech: React.FC = () => {
//   const [sentences, setSentences] = useState<string[]>([]);
//   const [currentSentence, setCurrentSentence] = useState<number>(-1);
//   const synthRef = useRef<SpeechSynthesis | null>(null);

//   useEffect(() => {
//     synthRef.current = window.speechSynthesis;
//   }, []);

//   const splitTextToSentences = (text: string) => {
//     const regex = /[^.!?]+[.!?]+/g;
//     return (
//       text
//         .replaceAll("„", "")
//         .replaceAll("”", "")
//         .replaceAll(":", "")
//         .match(regex) || []
//     );
//   };

//   const startSpeaking = () => {
//     if (!text) return;

//     const sentenceArray = splitTextToSentences(text);

//     setSentences(sentenceArray);
//     setCurrentSentence(0);
//     speakSentence(sentenceArray, 0);
//   };

//   const speakSentence = (sentenceArray: string[], index: number) => {
//     if (index >= sentenceArray.length) return;

//     const utterance = new SpeechSynthesisUtterance(sentenceArray[index]);

//     utterance.voice = window.speechSynthesis
//       .getVoices()
//       .find(
//         (voice) =>
//           voice.lang === "pl" ||
//           voice.name.toLowerCase().includes("pl") ||
//           voice.name.toLowerCase().includes("zosia")
//       )!;

//     utterance.onstart = () => setCurrentSentence(index);

//     utterance.onend = () => {
//       if (index + 1 < sentenceArray.length) {
//         speakSentence(sentenceArray, index + 1);
//       } else {
//         setCurrentSentence(-1);
//       }
//     };

//     synthRef.current?.speak(utterance);
//   };

//   return (
//     <div>
//       <Button
//         type="primary"
//         onClick={startSpeaking}
//         style={{ marginTop: "10px" }}
//       >
//         Start Speaking
//       </Button>
//       <div style={{ marginTop: "20px" }}>
//         {sentences.map((sentence, index) => (
//           <p
//             key={index}
//             style={{
//               backgroundColor:
//                 currentSentence === index ? "#e6f7ff" : "transparent",
//               padding: "5px",
//             }}
//           >
//             {sentence}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TextToSpeech;
