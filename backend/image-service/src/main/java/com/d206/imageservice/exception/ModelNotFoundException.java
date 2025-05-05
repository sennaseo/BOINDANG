package com.d206.imageservice.exception;

public class ModelNotFoundException extends RuntimeException {
  public ModelNotFoundException(String message) {
    super(message);
  }
}
