package com.promptguard.api.model;

public enum TaskStatus {
    TO_DO,       // La tâche est créée, le bouton affiche "Commencer"
    IN_PROGRESS, // L'employé a cliqué sur Commencer, la carte affiche "En cours"
    DONE         // L'employé a cliqué sur Terminer, la tâche est archivée/complétée
}