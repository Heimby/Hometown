import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Call backend to check if owner exists
      const response = await axios.post(`${API}/owners/login`, { email });
      
      if (response.data && response.data.id) {
        // Save owner data to localStorage
        localStorage.setItem('ownerProperty', JSON.stringify({
          id: response.data.id,
          address: response.data.address,
          property_address: response.data.address,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          onboarding_completed: response.data.onboarding_completed,
        }));
        
        // Redirect to owner portal
        window.location.href = '/owner-portal';
      } else {
        setError('Kunne ikke logge inn. Vennligst prøv igjen.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 404) {
        setError('Ingen eierportal funnet. Vennligst registrer deg først.');
      } else {
        setError('Kunne ikke logge inn. Vennligst prøv igjen.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Tilbake til Hjem</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Logg inn
            </h1>
            <p className="text-gray-600">
              Skriv inn e-postadressen din for å få tilgang til eierportalen
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center text-sm">
              En innloggingslenke er sendt til din e-post!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-postadresse
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gray-900 text-white rounded-xl text-base font-medium hover:bg-gray-800 transition-colors shadow-md"
            >
              Logg inn
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Har du ikke en konto?{' '}
              <Link to="/" className="text-gray-900 font-medium hover:underline">
                Registrer deg her
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
