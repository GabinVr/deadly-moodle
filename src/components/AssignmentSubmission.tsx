import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, Upload, Target, X, Globe } from 'lucide-react';

interface AssignmentConfig {
  title: string;
  description: string;
  dueDate: Date;
  openDate: Date;
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    appTitle: "Deadly Moodle",
    configureAssignment: "Configure Assignment",
    assignmentConfiguration: "Assignment Configuration",
    assignmentTitle: "Assignment Title",
    dueDateTime: "Due Date & Time",
    description: "Description",
    opened: "Opened",
    due: "Due",
    at: "at",
    submissionLate: "Your submission is late!",
    lateMessage: "This assignment was due {time} ago. Late submissions may be penalized.",
    timeOverdue: "Time Overdue",
    timeRemaining: "Time Remaining",
    submitDeadline: "Submit before the deadline to avoid penalties!",
    readyToSubmit: "Ready to Submit?",
    clickToSubmit: "Upload your file and submit your assignment",
    addSubmission: "Add Submission",
    submissionSuccessful: "Submission Successful!",
    submittedOn: "Your assignment was submitted on {date} at {time}",
    lateSubmission: "(LATE SUBMISSION)",
    submissionStatus: "Submission Status",
    attemptNumber: "Attempt number",
    attemptText: "This is attempt 1.",
    submissionStatusLabel: "Submission status",
    noSubmissions: "No submissions have been made yet",
    submittedForGrading: "Submitted for grading",
    gradingStatus: "Grading status",
    notGraded: "Not graded",
    timeRemainingLabel: "Time remaining",
    assignmentSubmittedLate: "Assignment was submitted {time} late",
    lastModified: "Last modified",
    realityCheck: "Reality Check Time!",
    motivationalMessage: "Don't add more time, champion. Work with what you've got and prove you can handle the pressure. Real growth happens when you push through constraints, not when you give yourself endless extensions.",
    stickToDeadline: "Set a realistic deadline and stick to it!",
    selectFile: "Select File",
    noFileSelected: "No file selected",
    fileSelected: "File selected: {filename}",
    submit: "Submit",
    cancel: "Cancel",
    uploadFile: "Upload your assignment file",
    copyright: "© 2025 Sandbag Corp. All rights reserved.",
    language: "Language",
    english: "English",
    french: "Français"
  },
  fr: {
    appTitle: "Deadly Moodle",
    configureAssignment: "Configurer le devoir",
    assignmentConfiguration: "Configuration du devoir",
    assignmentTitle: "Titre du devoir",
    dueDateTime: "Date et heure limite",
    description: "Description",
    opened: "Ouvert",
    due: "Échéance",
    at: "à",
    submissionLate: "Votre soumission est en retard !",
    lateMessage: "Ce devoir était dû il y a {time}. Les soumissions tardives peuvent être pénalisées.",
    timeOverdue: "Temps dépassé",
    timeRemaining: "Temps restant",
    submitDeadline: "Soumettez avant la date limite pour éviter les pénalités !",
    readyToSubmit: "Prêt à soumettre ?",
    clickToSubmit: "Téléchargez votre fichier et soumettez votre devoir",
    addSubmission: "Ajouter une soumission",
    submissionSuccessful: "Soumission réussie !",
    submittedOn: "Votre devoir a été soumis le {date} à {time}",
    lateSubmission: "(SOUMISSION TARDIVE)",
    submissionStatus: "Statut de la soumission",
    attemptNumber: "Numéro de tentative",
    attemptText: "Ceci est la tentative 1.",
    submissionStatusLabel: "Statut de soumission",
    noSubmissions: "Aucune soumission n'a encore été faite",
    submittedForGrading: "Soumis pour évaluation",
    gradingStatus: "Statut d'évaluation",
    notGraded: "Non évalué",
    timeRemainingLabel: "Temps restant",
    assignmentSubmittedLate: "Le devoir a été soumis avec {time} de retard",
    lastModified: "Dernière modification",
    realityCheck: "Moment de vérité !",
    motivationalMessage: "N'ajoute pas plus de temps, champion. Travaille avec ce que tu as et prouve que tu peux gérer la pression. La vraie croissance arrive quand tu surmontes les contraintes, pas quand tu te donnes des extensions infinies.",
    stickToDeadline: "Fixe une échéance réaliste et respecte-la !",
    selectFile: "Sélectionner un fichier",
    noFileSelected: "Aucun fichier sélectionné",
    fileSelected: "Fichier sélectionné : {filename}",
    submit: "Soumettre",
    cancel: "Annuler",
    uploadFile: "Téléchargez votre fichier de devoir",
    copyright: "© 2025 Sandbag Corp. Tous droits réservés.",
    language: "Langue",
    english: "English",
    french: "Français"
  }
};

const AssignmentSubmission: React.FC = () => {
  const [config, setConfig] = useState<AssignmentConfig>({
    title: "Critical Analysis Essay - Final Submission",
    description: "Write a comprehensive 3000-word critical analysis of the assigned readings. This assignment is worth 40% of your final grade.",
    dueDate: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now for demo
    openDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  });

  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isLate, setIsLate] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [submissionTime, setSubmissionTime] = useState<Date | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');

  // Detect browser language
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fr')) {
      setLanguage('fr');
    } else {
      setLanguage('en');
    }
  }, []);

  const t = (key: string, replacements?: { [key: string]: string }): string => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
      });
    }
    
    return text;
  };

  const formatTimeRemaining = (ms: number): string => {
    const isNegative = ms < 0;
    const absoluteMs = Math.abs(ms);
    
    const days = Math.floor(absoluteMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absoluteMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absoluteMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absoluteMs % (1000 * 60)) / 1000);

    let timeString = "";
    if (days > 0) timeString += `${days}j `;
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    timeString += `${seconds}s`;

    return isNegative ? `-${timeString}` : timeString;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const dueTime = config.dueDate.getTime();
      const difference = dueTime - now;
      
      setTimeRemaining(formatTimeRemaining(difference));
      setIsLate(difference < 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [config.dueDate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmission = () => {
    if (selectedFile) {
      setIsSubmitted(true);
      setSubmissionTime(new Date());
      setShowFileUpload(false);
      setSelectedFile(null);
    }
  };

  const updateConfig = (newConfig: Partial<AssignmentConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const switchLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('configureAssignment')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Motivational Banner */}
          {showConfig && (
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg p-6 mb-6 border-l-4 border-red-700 transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{t('realityCheck')}</h3>
                  <p className="text-orange-100 text-lg leading-relaxed">
                    {t('motivationalMessage')}
                    <span className="font-semibold text-white"> {t('stickToDeadline')}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Panel */}
          {showConfig && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assignmentConfiguration')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('assignmentTitle')}</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => updateConfig({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('dueDateTime')}</label>
                  <input
                    type="datetime-local"
                    value={config.dueDate.toISOString().slice(0, 16)}
                    onChange={(e) => updateConfig({ dueDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                  <textarea
                    value={config.description}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Assignment Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{t('opened')}:</span>
                  <span className="font-medium">{config.openDate.toLocaleDateString()} {t('at')} {config.openDate.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{t('due')}:</span>
                  <span className="font-medium">{config.dueDate.toLocaleDateString()} {t('at')} {config.dueDate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700 leading-relaxed">{config.description}</p>
            </div>
          </div>

          {/* Timer Warning */}
          {isLate && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-pulse">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-bold text-red-800">{t('submissionLate')}</h3>
                  <p className="text-red-700">{t('lateMessage', { time: timeRemaining.replace('-', '') })}</p>
                </div>
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          <div className={`bg-white rounded-lg shadow-lg border-2 ${isLate ? 'border-red-500 bg-red-50' : 'border-yellow-400 bg-yellow-50'} p-6 mb-6`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className={`w-6 h-6 ${isLate ? 'text-red-600' : 'text-yellow-600'}`} />
                <h3 className={`text-xl font-bold ${isLate ? 'text-red-800' : 'text-yellow-800'}`}>
                  {isLate ? t('timeOverdue') : t('timeRemaining')}
                </h3>
              </div>
              <div className={`text-4xl font-mono font-bold ${isLate ? 'text-red-600' : 'text-yellow-600'} tracking-wider`}>
                {timeRemaining}
              </div>
              {!isLate && (
                <p className="text-yellow-700 mt-2">{t('submitDeadline')}</p>
              )}
            </div>
          </div>

          {/* File Upload Modal */}
          {showFileUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('uploadFile')}</h3>
                  <button
                    onClick={() => setShowFileUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('selectFile')}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      {t('fileSelected', { filename: selectedFile.name })}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFileUpload(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSubmission}
                    disabled={!selectedFile}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('submit')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submission Section */}
          {!isSubmitted ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-center py-8">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('readyToSubmit')}</h3>
                <p className="text-gray-600 mb-6">{t('clickToSubmit')}</p>
                <button
                  onClick={() => setShowFileUpload(true)}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {t('addSubmission')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">{t('submissionSuccessful')}</h3>
              </div>
              <p className="text-green-700">
                {t('submittedOn', { 
                  date: submissionTime?.toLocaleDateString() || '', 
                  time: submissionTime?.toLocaleTimeString() || '' 
                })}
                {isLate && <span className="font-semibold text-red-600"> {t('lateSubmission')}</span>}
              </p>
            </div>
          )}

          {/* Submission Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{t('submissionStatus')}</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">{t('attemptNumber')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t('attemptText')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">{t('submissionStatusLabel')}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isSubmitted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isSubmitted ? t('submittedForGrading') : t('noSubmissions')}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">{t('gradingStatus')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t('notGraded')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">{t('timeRemainingLabel')}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${isLate ? 'text-red-600' : 'text-blue-600'}`}>
                      {isLate ? t('assignmentSubmittedLate', { time: timeRemaining.replace('-', '') }) : timeRemaining}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">{t('lastModified')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {submissionTime ? `${submissionTime.toLocaleDateString()} ${t('at')} ${submissionTime.toLocaleTimeString()}` : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              {t('copyright')}
            </div>
            
            {/* Language Selection */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{t('language')}:</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('english')}
                </button>
                <button
                  onClick={() => switchLanguage('fr')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'fr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('french')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssignmentSubmission;