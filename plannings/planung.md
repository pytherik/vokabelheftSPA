# Lastenheft

- Onlinetoool zum lernen von Vokabeln
- beide Richtungen (englisch-deutsch deutsch-englisch)
- für mehrere Benutzer mit eigener Sammlung 
- in eigener Sammlung Kommentare möglich
- Vokabeln von allen einsehbar 
- 14 tage zeit


# Pflichtenheft

## Start der Anwendung

### Login Seite erstellen
- Input Felder name und passwort und Submit Button
- Submit wird gedrückt
  - Überprüfung der Angaben
  - bei Fehleingaben warnen
  - bei erfolgreicher Anmeldung Startseite anzeigen
  - auf Serverseite wird Session gestartet und Benutzer Id in 
    Session Variable gespeichert
  - in Local Storage werden Benutzer Id, Benutzernam, 
    aktuelles Datum, Eintrittsdatum und Startsprache gesetzt

### Startseite erstellen

- Navigationsleiste aufbauen
  - Button zum Erstellen einer neuen Vokabel,
  - Buttons Auswahl der Sprache,
  - Logout Button erstellen
- Listenansichten erstellen
  - alle Vokabeln aus eigenes Heft anzeigen, Datenbankabfrage (DB Abfrage)
  - alle Vokabeln aus alle Vokabeln anzeigen, DB Abfrage
- Lernen Buttons für eigene Vokabeln und alle Vokabeln erstellen

### Navigations Funktionen
- Button neue Vokabel erstellen wurde gedrückt
  - Modal zum Ändern erstellen
    - Input Wort
    - Radio Buttons Wortart: Substantiv, Verb, Adjektiv, Andere
    - Input Übersetzung mit Hinzufügen Button für bis  
      zu drei weiteren Übersetzungen
    - Submit Button
  - Submit Button wurde gedrückt
    - Überprüfen der Eingaben
    - bei Fehlern Warnhinweise geben
    - Überprüfen der DB ob Wort existiert
      - wenn Wort nicht existiert wird es angelegt
      - wenn Wort existiert und nicht in eigenes Heft ist
        wird es dort eingetragen, nicht in DB
      - wenn Wort im eigenen Heft ist keine Aktion
    - Aktionsinfo für zwei Sekunden anzeigen und Modal schließen
- Buttons zu Auswahl der Sprache(Flaggensymbole England, Deutschland)
  - Anzeigesprache und Vokabelanzeige werden der gewählten Sprache angepass
  - Spracheintrag in Local Storage wird angepasst
- Logout Button
  - Benutzer wird abgemeldet, Local Storage wird gelöscht
  - Login Seite wird angezeigt

### Eigenes Heft
- Buttons Entfernen und Editieren für jede Vokabel
  - Button Vokabel entfernen wird gedrückt
    - DB Abfrage, Vokabel aus eigenes Heft entfernen
    - in Liste alle Vokabeln Hinzufügen-Button anzeigen 
  - Vokabel editieren
    - Modal anzeigen zum editieren der Beschreibung
      - Abbrechen Button erstellen
      - Informationen über Vokabel anzeigen  
        (Autor, Wort, Übersetzungen, Wortart Beschreibung)
      - Beschreibung in editierbarem Texteigabefeld
      - Submit Button erstellen
    - Abbrechen Button wurde gedrückt
      - Modal löschen, keine weitere Aktion
    - Submit Button wurde gedrückt
      - Ändern der Beschreibung in der DB
      - Modal löschen

### Alle Vokabeln
- Hinzufügen Button oder Häkchensymbol anzeigen für jede Vokabel
  - Vokabel ist nicht in eigenes Heft: Hinzufügen Button anzeigen 
  - Vokabel ist in eigenes Heft: Häkchen Symbol anzeigen
- Hinzufügen Button wurde gedrückt
  - Vokabel in eigenes Heft anzeigen
  - Hizufügen Button in Häkchen Symbol ändern

### Lernen Buttons

- Lernen Seite aufbauen
  - neue Vokabel erstellen in Naviagationsleiste in 
    zurück zur Startseite ändern
    - klick baut Startseite erneut auf
  - Statistik Tabellen aufbauen
    - Statistik heute und Statistik gesamt mit Einträgen für 
      Anzahl Richtig, Falsch und Total aus DB Abfrage berechnen
- eigene Vokabeln lernen 
  - Zufallsvokabel nur aus Vokabeln in DB Tabelle user_pool der 
    aktuell gesetzten Sprache plus alle Informationen zum Überprüfen 
    aus DB holen
- alle Vokabeln lernen
  - wie eigene Vokabeln aber aus allen Vokabeln der  DB Tabellen 
    german oder english erzeugen
- Ausgabe des Wortes incl. Wortart 
- Input Feld für Übersetzung erstellen 
- Eingabe prüfen-Button anzeigen
  - wenn gedrückt, überprüfen ob Inputfeld leer ist und ggf. Hinweis anzeigen
  - Eingabe mit möglichen Überetzungen vergleichen und Ergebnis mit
    Datum, BenutzerId, WortId in DB Tabelle statistics speichern