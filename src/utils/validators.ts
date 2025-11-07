export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  name: (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (name.length < 2) {
      errors.push('الاسم يجب أن يكون حرفين على الأقل');
    }
    
    if (name.length > 50) {
      errors.push('الاسم يجب أن يكون أقل من 50 حرف');
    }
    
    if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(name)) {
      errors.push('الاسم يجب أن يحتوي على أحرف فقط');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  bio: (bio: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (bio.length > 200) {
      errors.push('النبذة الشخصية يجب أن تكون أقل من 200 حرف');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  message: (message: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (message.trim().length === 0) {
      errors.push('الرسالة لا يمكن أن تكون فارغة');
    }
    
    if (message.length > 1000) {
      errors.push('الرسالة يجب أن تكون أقل من 1000 حرف');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  groupName: (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (name.trim().length === 0) {
      errors.push('اسم المجموعة لا يمكن أن يكون فارغاً');
    }
    
    if (name.length > 50) {
      errors.push('اسم المجموعة يجب أن يكون أقل من 50 حرف');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  groupDescription: (description: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (description.length > 200) {
      errors.push('وصف المجموعة يجب أن يكون أقل من 200 حرف');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  fileSize: (size: number, maxSize: number = 10 * 1024 * 1024): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (size > maxSize) {
      errors.push(`حجم الملف يجب أن يكون أقل من ${Math.round(maxSize / (1024 * 1024))} ميجابايت`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  fileType: (mimeType: string, allowedTypes: string[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!allowedTypes.includes(mimeType)) {
      errors.push('نوع الملف غير مدعوم');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
