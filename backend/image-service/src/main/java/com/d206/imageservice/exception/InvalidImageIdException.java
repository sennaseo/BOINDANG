package com.d206.imageservice.exception;

public class InvalidImageIdException extends RuntimeException {
    public InvalidImageIdException(String message) {
        super(message);
    }
}