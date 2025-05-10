package com.boindanguser.user.model.type;

import com.boindanguser.user.model.type.EnumValidator;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class EnumValidatorImpl implements ConstraintValidator<EnumValidator, String> {

    private EnumValidator annotation;

    @Override
    public void initialize(EnumValidator constraintAnnotation) {
        this.annotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;
        return Arrays.stream(annotation.enumClass().getEnumConstants())
                .map(Enum::name)
                .anyMatch(e -> e.equals(value));
    }
}
