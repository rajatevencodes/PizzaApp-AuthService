
import { describe, expect, it } from "@jest/globals";
import { isValidEmail, isValidPassword } from "../../src/utils";

// * Make sure to remove 'skip' to run these tests

describe.skip('isValidEmail', () => {

    it('should return true for a valid email', () => {
      // Arrange
      const validEmail = 'test@example.com';
      // Act
      const result = isValidEmail(validEmail);
      // Assert
      expect(result).toBe(true);
    });
  
    it('should return true for a valid email with subdomains', () => {
      // Arrange
      const validEmail = 'user.name@sub.domain.co.uk';
      // Act
      const result = isValidEmail(validEmail);
      // Assert
      expect(result).toBe(true);
    });
  
    it('should return false for an email missing the @ symbol', () => {
      // Arrange
      const invalidEmail = 'test.example.com';
      // Act
      const result = isValidEmail(invalidEmail);
      // Assert
      expect(result).toBe(false);
    });
  
    it('should return false for an email missing the domain', () => {
      // Arrange
      const invalidEmail = 'test@';
      // Act
      const result = isValidEmail(invalidEmail);
      // Assert
      expect(result).toBe(false);
    });
  
    it('should return false for an email with spaces', () => {
      // Arrange
      const invalidEmail = 'test @example.com';
      // Act
      const result = isValidEmail(invalidEmail);
      // Assert
      expect(result).toBe(false);
    });
  
    it('should return false for an empty string', () => {
      // Arrange
      const invalidEmail = '';
      // Act
      const result = isValidEmail(invalidEmail);
      // Assert
      expect(result).toBe(false);
    });
  });
  

describe.skip('isValidPassword', () => {
  
    it('should return an empty string for a valid password', () => {
      // Arrange
      const validPassword = 'StrongP@ssw0rd!';
      // Act
      const result = isValidPassword(validPassword);
      // Assert
      expect(result).toBe("");
    });
  
    it('should return an error for a password that is too short', () => {
      // Arrange
      const weakPassword = 'Sh0rt!';
      // Act
      const result = isValidPassword(weakPassword);
      // Assert
      expect(result).toBe("Password must be at least 8 characters long");
    });
  
    it('should return an error for a password missing an uppercase letter', () => {
      // Arrange
      const weakPassword = 'strongp@ssw0rd!';
      // Act
      const result = isValidPassword(weakPassword);
      // Assert
      expect(result).toBe("Password must contain at least one uppercase letter");
    });
  
    it('should return an error for a password missing a lowercase letter', () => {
      // Arrange
      const weakPassword = 'STRONGP@SSW0RD!';
      // Act
      const result = isValidPassword(weakPassword);
      // Assert
      expect(result).toBe("Password must contain at least one lowercase letter");
    });
  
    it('should return an error for a password missing a number', () => {
      // Arrange
      const weakPassword = 'StrongP@ssword!';
      // Act
      const result = isValidPassword(weakPassword);
      // Assert
      expect(result).toBe("Password must contain at least one number");
    });
  
    it('should return an error for a password missing a special character', () => {
      // Arrange
      const weakPassword = 'StrongPassw0rd';
      // Act
      const result = isValidPassword(weakPassword);
      // Assert
      expect(result).toBe("Password must contain at least one special character");
    });
  
    it('should return an error for a common weak password (e.g., "password")', () => {
      // Arrange
      const weakPassword = 'password123!'; // Will be caught by the common list
      // Act
      const result = isValidPassword(weakPassword);
      // Assert
      expect(result).toBe("Password is too common, please choose a stronger password");
    });

});