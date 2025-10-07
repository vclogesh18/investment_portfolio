import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface FormField {
  id: number;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required: boolean;
  field_order: number;
  options?: Array<{ value: string; label: string }>;
  validation_rules?: any;
  default_value?: string;
  help_text?: string;
  max_length?: number;
  min_length?: number;
}

interface FormData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  success_message?: string;
  fields: FormField[];
}

interface DynamicFormProps {
  slug: string;
  className?: string;
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: string) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  slug, 
  className = "", 
  onSubmitSuccess, 
  onSubmitError 
}) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch form configuration
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/forms/slug/${slug}`);
        
        if (!response.ok) {
          throw new Error('Form not found');
        }
        
        const result = await response.json();
        if (result.success) {
          setFormData(result.data);
          
          // Initialize form values with default values
          const initialValues: Record<string, any> = {};
          result.data.fields.forEach((field: FormField) => {
            if (field.default_value) {
              initialValues[field.name] = field.default_value;
            }
          });
          setFormValues(initialValues);
        }
      } catch (error) {
        console.error('Error fetching form:', error);
        setErrors({ general: 'Failed to load form. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchForm();
    }
  }, [slug]);

  // Handle input changes
  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData) return false;
    
    const newErrors: Record<string, string> = {};
    
    formData.fields.forEach(field => {
      const value = formValues[field.name];
      
      // Required field validation
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
      
      // Skip further validation if field is empty and not required
      if (!value || value.toString().trim() === '') return;
      
      // Type-specific validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      
      // Custom validation rules
      const rules = field.validation_rules || {};
      
      if (rules.minLength && value.length < rules.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${rules.minLength} characters`;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors[field.name] = `${field.label} must be no more than ${rules.maxLength} characters`;
      }
      
      if (rules.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          newErrors[field.name] = `${field.label} format is invalid`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/forms/slug/${slug}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        setSubmitMessage(result.message || 'Thank you for your submission!');
        setFormValues({});
        onSubmitSuccess?.(result);
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          // Handle validation errors from backend
          const errorObj: Record<string, string> = {};
          result.errors.forEach((error: string) => {
            errorObj.general = error;
          });
          setErrors(errorObj);
        } else {
          setErrors({ general: result.error || 'Submission failed. Please try again.' });
        }
        onSubmitError?.(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setErrors({ general: errorMessage });
      onSubmitError?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Render form field
  const renderField = (field: FormField) => {
    const value = formValues[field.name] || '';
    const hasError = !!errors[field.name];
    
    const baseClassName = `w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
      hasError 
        ? 'border-red-500 bg-red-50' 
        : 'border-slate-300 hover:border-slate-400 focus:border-amber-500'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClassName}
            maxLength={field.max_length}
            minLength={field.min_length}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClassName}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClassName}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={4}
            className={baseClassName}
            maxLength={field.max_length}
            minLength={field.min_length}
          />
        );
      
      case 'select':
        const selectOptions = field.options || [];
        return (
          <select
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClassName}
          >
            <option value="">Select an option</option>
            {selectOptions.map((option: { value: string; label: string }, index: number) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        const radioOptions = field.options || [];
        return (
          <div className="space-y-3">
            {radioOptions.map((option: { value: string; label: string }, index: number) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-4 h-4 text-amber-500 border-slate-300 focus:ring-amber-500"
                />
                <span className="text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        const checkboxOptions = field.options || [];
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {checkboxOptions.map((option: { value: string; label: string }, index: number) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkboxValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...checkboxValues, option.value]
                      : checkboxValues.filter((v: string) => v !== option.value);
                    handleInputChange(field.name, newValues);
                  }}
                  className="w-4 h-4 text-amber-500 border-slate-300 focus:ring-amber-500 rounded"
                />
                <span className="text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            onChange={(e) => handleInputChange(field.name, e.target.files?.[0])}
            className={`${baseClassName} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100`}
            accept={field.validation_rules?.accept}
          />
        );
      
      default:
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseClassName}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="ml-2 text-slate-600">Loading form...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Form Not Found</h3>
        <p className="text-slate-600">The requested form could not be loaded.</p>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Success!</h3>
        <p className="text-lg text-slate-600 mb-6">{submitMessage}</p>
        <button
          onClick={() => {
            setSubmitSuccess(false);
            setSubmitMessage('');
          }}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-300"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {formData.description && (
        <div className="mb-8 text-center">
          <p className="text-lg text-slate-600">{formData.description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.fields
          .sort((a, b) => a.field_order - b.field_order)
          .map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {field.help_text && (
                <p className="text-sm text-slate-500">{field.help_text}</p>
              )}
              
              {errors[field.name] && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errors.general}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit {formData.name}</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;