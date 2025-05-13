package com.d206.imageservice.exception;

public class MissingUuidException extends RuntimeException {
    public MissingUuidException(String message) {
        super(message);
    }
}