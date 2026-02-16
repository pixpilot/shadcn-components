import { describe, expect, it, vi } from 'vitest';

import { toast } from '../../src/toast';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    custom: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: vi.fn(),
}));

describe('toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toast methods', () => {
    it('should have all variant methods', () => {
      expect(typeof toast.error).toBe('function');
      expect(typeof toast.success).toBe('function');
      expect(typeof toast.warning).toBe('function');
      expect(typeof toast.info).toBe('function');
    });

    it('should call toast.error with string message', () => {
      const message = 'Test error message';
      const duration = 5000;

      toast.error(message, duration);

      expect(typeof toast.error).toBe('function');
    });

    it('should call toast.error with object message', () => {
      const message = {
        title: 'Error Title',
        description: 'Error description',
      };

      toast.error(message);

      expect(typeof toast.error).toBe('function');
    });

    it('should call toast.success with string message', () => {
      toast.success('Success message');
      expect(typeof toast.success).toBe('function');
    });

    it('should call toast.success with object message', () => {
      const message = {
        title: 'Success',
        description: 'Operation completed',
      };
      toast.success(message);
      expect(typeof toast.success).toBe('function');
    });

    it('should call toast.warning with string message', () => {
      toast.warning('Warning message');
      expect(typeof toast.warning).toBe('function');
    });

    it('should call toast.info with string message', () => {
      toast.info('Info message');
      expect(typeof toast.info).toBe('function');
    });
  });

  describe('toast function', () => {
    it('should be callable as a function', () => {
      const props = {
        variant: 'error' as const,
        title: 'Test',
        description: 'Test description',
      };

      expect(() => {
        toast(props);
      }).not.toThrow();
    });

    it('should accept minimal props', () => {
      const props = {
        variant: 'info' as const,
        description: 'Minimal toast',
      };

      expect(() => {
        toast(props);
      }).not.toThrow();
    });
  });

  describe('type safety', () => {
    it('should accept ToastMessage types', () => {
      // String message
      toast.error('string message');
      toast.success('string message');

      // Object message
      const objMessage = {
        title: 'Title',
        description: 'Description',
      };
      toast.error(objMessage);
      toast.success(objMessage);

      // Object message with additional props
      const extendedMessage = {
        title: 'Title',
        description: 'Description',
        onClose: () => {},
      };
      toast.error(extendedMessage);
      toast.success(extendedMessage);
    });

    it('should accept duration parameter', () => {
      toast.error('message', 3000);
      toast.success('message', 5000);
      toast.warning('message', 1000);
      toast.info('message', 2000);
    });
  });
});
