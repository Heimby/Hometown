import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, Edit2, FileImage, MessageSquare } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FloorPlanTab = ({ ownerId }) => {
  const [floorPlanData, setFloorPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [comment, setComment] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(null); // 'text', 'marker', 'line'
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (ownerId) {
      fetchFloorPlan();
    }
  }, [ownerId]);

  const fetchFloorPlan = async () => {
    try {
      const response = await axios.get(`${API}/owners/${ownerId}/floor-plan`);
      setFloorPlanData(response.data);
      setComment(response.data.comment || '');
      setAnnotations(response.data.annotations || []);
    } catch (error) {
      console.error('Failed to fetch floor plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await axios.post(
        `${API}/owners/${ownerId}/floor-plan/upload-image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      await fetchFloorPlan();
      alert('Planløsning lastet opp!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Kunne ikke laste opp bildet. Prøv igjen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveComment = async () => {
    try {
      await axios.put(`${API}/owners/${ownerId}/floor-plan`, {
        comment: comment
      });
      await fetchFloorPlan();
      setEditingComment(false);
      alert('Kommentar lagret!');
    } catch (error) {
      console.error('Failed to save comment:', error);
      alert('Kunne ikke lagre kommentar. Prøv igjen.');
    }
  };

  const handleAddAnnotation = async (annotation) => {
    try {
      const response = await axios.post(
        `${API}/owners/${ownerId}/floor-plan/annotations`,
        annotation
      );
      setAnnotations([...annotations, response.data]);
    } catch (error) {
      console.error('Failed to add annotation:', error);
    }
  };

  const handleDeleteAnnotation = async (annotationId) => {
    try {
      await axios.delete(`${API}/owners/${ownerId}/floor-plan/annotations/${annotationId}`);
      setAnnotations(annotations.filter(a => a.id !== annotationId));
    } catch (error) {
      console.error('Failed to delete annotation:', error);
    }
  };

  const handleCanvasClick = (e) => {
    if (!drawMode || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (drawMode === 'marker') {
      const text = prompt('Skriv inn tekst for markøren:');
      if (text) {
        handleAddAnnotation({
          type: 'marker',
          x,
          y,
          text,
          color: '#EF4444'
        });
      }
    } else if (drawMode === 'text') {
      const text = prompt('Skriv inn tekst:');
      if (text) {
        handleAddAnnotation({
          type: 'text',
          x,
          y,
          text,
          color: '#000000'
        });
      }
    }

    setDrawMode(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Upload Section */}
      {!floorPlanData?.image_url ? (
        <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 text-center mb-6">
          <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Last opp planløsning</h3>
          <p className="text-gray-600 mb-6">
            Last opp et bilde av planløsningen for å komme i gang
          </p>
          <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            {uploading ? 'Laster opp...' : 'Velg bilde'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Image Display with Annotations */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Planløsning</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setDrawMode('marker')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    drawMode === 'marker'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  📍 Marker
                </button>
                <button
                  onClick={() => setDrawMode('text')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    drawMode === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  ✏️ Tekst
                </button>
                <label className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Laster...' : 'Bytt bilde'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {drawMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <strong>Tegnemodus aktiv:</strong> Klikk på bildet for å plassere en {drawMode === 'marker' ? 'markør' : 'tekst'}
              </div>
            )}

            <div className="relative inline-block max-w-full">
              <img
                ref={imageRef}
                src={`${BACKEND_URL}${floorPlanData.image_url}`}
                alt="Planløsning"
                className="max-w-full h-auto rounded-lg border border-gray-300 cursor-crosshair"
                onClick={handleCanvasClick}
              />
              
              {/* Render Annotations */}
              {annotations.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    position: 'absolute',
                    left: `${ann.x}%`,
                    top: `${ann.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Vil du slette denne annoteringen?')) {
                      handleDeleteAnnotation(ann.id);
                    }
                  }}
                >
                  {ann.type === 'marker' && (
                    <div className="relative group">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        📍
                      </div>
                      {ann.text && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {ann.text}
                        </div>
                      )}
                    </div>
                  )}
                  {ann.type === 'text' && (
                    <div
                      className="px-2 py-1 bg-white border-2 border-gray-900 rounded text-sm font-semibold shadow-lg"
                      style={{ color: ann.color }}
                    >
                      {ann.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {annotations.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <strong>{annotations.length}</strong> annotering(er) lagt til. Klikk på en for å slette.
              </div>
            )}
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Kommentar til planløsning
              </h3>
              {!editingComment ? (
                <button
                  onClick={() => setEditingComment(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Rediger
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveComment}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Lagre
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(false);
                      setComment(floorPlanData.comment || '');
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>

            {editingComment ? (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows="6"
                placeholder="Skriv en kommentar om planløsningen... F.eks. spesielle detaljer, endringer som er gjort, eller viktig informasjon for gjester."
              />
            ) : (
              <div className="text-gray-700">
                {comment || (
                  <p className="text-gray-400 italic">Ingen kommentar lagt til ennå</p>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Slik bruker du verktøyet</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Klikk på "Marker" eller "Tekst" for å aktivere tegnemodus</li>
              <li>Klikk på bildet for å plassere en annotasjon</li>
              <li>Hold musepekeren over en markør for å se teksten</li>
              <li>Klikk på en annotasjon for å slette den</li>
              <li>Bruk kommentarfeltet for å legge til generell informasjon</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanTab;
