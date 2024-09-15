Therefore creating tasks and lists are so important... I could save a lot of time, maybe 20h or more, if only I do basic version and improve it during developing

15.09

1. get 1000 words from server
2. convert to sentences
3. speak sentences
4. after end fetch another 1000
5. run speaking automatyclly

6. the problem is with renders after

   return () => {
   window.speechSynthesis.cancel();
   };

7. how to delte double render ? XD

8. add stop, pouse buttons
9. add 'nextChunk' implementation

   14.09.24

// Send 1000 words -> chunk by sentence setCurrentSentenceIndex

TODO:
try:
-loadBook
-handleNext
-add text-to-speach

on server:

1. store book as a .txt file
2. count words -> create .json with info about book and user progress (bookTitle, wordsInBook, userProgress )
3. chunk .txt file by 500 words -> send to client

client:

1. select book
2. get current and next 500 words (+ userProgress, wordsInBook)
3. send request with ask about next 500words -> server should save this info in variable "userProgress"

//

zamian " na '
enter na spacje

    "@types/pdf-parse": "^1.1.4",
    "@types/pdfjs-dist": "^2.10.378",
    "fs": "^0.0.1-security",
    "pdf-lib": "^1.17.1",
    "pdf-parse": "^1.1.1",
