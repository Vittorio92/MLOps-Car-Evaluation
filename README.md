# Car-eval-MLOps
Il progetto, realizzato per il corso di Sistemi distribuiti e Cloud Computing (LM), implementa una pipeline automatizzata di Machine Learning basata su architettura utilizzando i servizi cloud di Microsoft Azure. Il sistema sfrutta il dataset pubblico Car Evaluation per classificare la qualità delle automobili in base a specifiche caratteristiche


🚀 Obiettivi principali
1. Automatizzare il flusso completo di un'applicazione ML: data ingestion, preprocessing, training, inferenza.
2. Utilizzare Azure Functions (FaaS) per gestire ogni fase in modo scalabile e reattivo.
3. Sfruttare Azure Blob Storage per l'archiviazione dei dati e dei modelli.
4. Esporre un endpoint HTTP per l'inferenza in tempo reale.

🧱 Architettura della pipeline
1. Upload Dataset (Trigger iniziale): Il caricamento del file car.data su Azure Blob Storage attiva una funzione serverless.
2.Preprocessing dei Dati: La funzione legge il file, effettua encoding delle feature categoriche e salva i dati puliti in uno storage separato.
3.Training del Modello: Un'altra funzione FaaS legge i dati preprocessati, addestra un classificatore ML (es. Random Forest), e salva il modello serializzato.
4.Inferenza via HTTP: Una funzione HTTP riceve nuovi input, applica il preprocessing e restituisce la predizione del modello.
