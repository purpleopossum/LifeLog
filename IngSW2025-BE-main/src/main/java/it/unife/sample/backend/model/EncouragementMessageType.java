package it.unife.sample.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EncouragementMessageType {
    KEEP_GOING("Keep going 🔥"),
    YOU_ARE_DOING_GREAT("You're doing great"),
    DONT_BREAK_THE_STREAK("Don't break the streak"),
    PROUD_OF_YOU("Proud of you"),
    ONE_MORE_DAY("One more day");

    private final String message;

    EncouragementMessageType(String message) {
        this.message = message;
    }

    @JsonValue
    public String getMessage() {
        return message;
    }

    @JsonCreator
    public static EncouragementMessageType fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        for (EncouragementMessageType type : values()) {
            if (type.name().equalsIgnoreCase(value) || type.message.equalsIgnoreCase(value)) {
                return type;
            }
        }

        throw new IllegalArgumentException("Invalid encouragement message: " + value);
    }
}