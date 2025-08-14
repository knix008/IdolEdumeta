module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Suppress warnings for unused variables that are intentionally kept for future use
    'no-unused-vars': 'warn',
    
    // Suppress warnings for exhaustive deps in useEffect when we intentionally want to run only once
    'react-hooks/exhaustive-deps': 'warn',
    
    // Allow console.error for debugging purposes
    'no-console': 'off',
    
    // Allow unused variables in destructuring
    'no-unused-vars': ['warn', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true 
    }]
  }
};
