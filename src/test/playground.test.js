import { describe, it, expect, beforeEach } from 'vitest';
import { STARTER_TEMPLATES } from '../features/playground/templates';
import { getAIConfigurationStatus } from '../services/aiMentorService';

describe('Coding Playground Templates & Service Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const expectedTemplateKeys = [
    'counter',
    'todo',
    'portfolio',
    'calculator',
    'clock',
    'color_changer',
    'landing_page',
  ];

  it('contains all 7 required starter templates', () => {
    expectedTemplateKeys.forEach((key) => {
      expect(STARTER_TEMPLATES).toHaveProperty(key);
      const tmpl = STARTER_TEMPLATES[key];
      expect(tmpl.name).toBeTruthy();
      expect(tmpl.html.trim().length).toBeGreaterThan(20);
      expect(tmpl.css.trim().length).toBeGreaterThan(20);
      expect(tmpl.js.trim().length).toBeGreaterThan(10);
    });
  });

  it('correctly reports unconfigured state when no credentials exist', () => {
    const status = getAIConfigurationStatus();
    expect(status.isConfigured).toBe(false);
    expect(status.mode).toBe('unconfigured');
  });

  it('detects client-configured development API key if provided', () => {
    localStorage.setItem('devacademy_ai_api_key', 'sk-test-12345');
    const status = getAIConfigurationStatus();
    expect(status.isConfigured).toBe(true);
    expect(status.mode).toBe('direct-key');
  });
});
