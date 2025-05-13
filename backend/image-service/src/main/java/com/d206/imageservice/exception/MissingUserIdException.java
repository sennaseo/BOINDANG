package com.d206.imageservice.exception;

public class MissingUserIdException extends RuntimeException {
    public MissingUserIdException(String message) {
        super(message);
    }

}