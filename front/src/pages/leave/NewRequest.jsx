import React, { useState } from 'react';
import { FiCalendar, FiUser, FiClock, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NewRequest = ({ darkMode = false, isHRView = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee: isHRView ? '' : 'Jean Dupont',
    type: 'paid',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    { value: 'paid', label: 'Congé payé' },
    { value: 'sick', label: 'Maladie' },
    { value: 'unpaid', label: 'Sans solde' },
    { value: 'parental', label: 'Parental' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Ce champ est requis';
    if (!formData.endDate) newErrors.endDate = 'Ce champ est requis';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }
    if (isHRView && !formData.employee) newErrors.employee = 'Ce champ est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Demande soumise:', formData);
      navigate('/dashboard/leave/requests', { state: { success: true } });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardClass = darkMode 
    ? 'bg-slate-800 border-slate-700 text-white' 
    : 'bg-white border-gray-200 text-gray-800';

  const inputClass = darkMode 
    ? 'bg-slate-700 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white' 
    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-800';

  return (
    <div className={`max-w-4xl mx-auto p-4 md:p-6 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'} min-h-screen`}>
      <div className={`rounded-xl shadow-md border ${cardClass} p-6 mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Nouvelle demande de congé</h1>
            <p className={`${darkMode ? 'text-slate-300' : 'text-gray-600'} mt-1`}>
              Remplissez le formulaire pour soumettre votre demande
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/leave/requests')}
            className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <FiX className="mr-2" />
            Annuler
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {isHRView && (
              <div>
                <label className="block mb-2 font-medium">
                  <span className="flex items-center">
                    <FiUser className="mr-2" />
                    Employé
                  </span>
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${inputClass} ${errors.employee ? 'border-red-500' : ''}`}
                >
                  <option value="">Sélectionner un employé</option>
                  <option value="Jean Dupont">Jean Dupont</option>
                  <option value="Marie Lambert">Marie Lambert</option>
                  <option value="Pierre Martin">Pierre Martin</option>
                </select>
                {errors.employee && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.employee}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium">
                <span className="flex items-center">
                  <FiClock className="mr-2" />
                  Type de congé
                </span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${inputClass}`}
              >
                {leaveTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                <span className="flex items-center">
                  <FiCalendar className="mr-2" />
                  Date de début
                </span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${inputClass} ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">
                <span className="flex items-center">
                  <FiCalendar className="mr-2" />
                  Date de fin
                </span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${inputClass} ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>

            {formData.startDate && formData.endDate && (
              <div className="md:col-span-2">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  <p className="font-medium">
                    Période sélectionnée: {formData.startDate} au {formData.endDate} • 
                    <span className="ml-2">
                      {Math.floor((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1} jours
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Raison (optionnel)
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg ${inputClass}`}
                placeholder="Décrivez la raison de votre demande..."
              />
            </div>

            {formData.type === 'sick' && (
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">
                  Contact d'urgence
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${inputClass}`}
                  placeholder="Nom et numéro de téléphone"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Pièces jointes (optionnel)
              </label>
              <div className={`border-2 border-dashed rounded-lg p-4 ${darkMode ? 'border-slate-600' : 'border-gray-300'}`}>
                <input
                  type="file"
                  id="attachments"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
                <label
                  htmlFor="attachments"
                  className={`flex flex-col items-center justify-center p-4 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}
                >
                  <FiCalendar className="text-2xl mb-2 text-blue-500" />
                  <p className="text-center">
                    <span className="text-blue-500 font-medium">Cliquez pour téléverser</span> ou glissez-déposez vos fichiers
                  </p>
                  <p className="text-sm mt-1 text-gray-500">PDF, JPG, PNG (max. 5MB)</p>
                </label>

                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-opacity-20 bg-blue-500">
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Soumettre la demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className={`rounded-xl shadow-md border ${cardClass} p-6`}>
        <h2 className="text-xl font-bold mb-4">Politique de congés</h2>
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2">
            <li>Les demandes doivent être soumises au moins 48 heures à l'avance (sauf cas d'urgence)</li>
            <li>Les congés payés sont accordés selon l'ancienneté</li>
            <li>Les certificats médicaux sont requis pour les absences de plus de 3 jours</li>
            <li>Les demandes sont traitées sous 72 heures ouvrables</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
