"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  Zap, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  Heart, 
  Key, 
  TrendingUp 
} from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'customer_segments' | 'value_propositions' | 'channels' | 'customer_relationships' | 'revenue_streams' | 'key_resources' | 'key_activities' | 'key_partnerships' | 'cost_structure';
  title: string;
  content: string[];
  color: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
}

interface VisualBusinessModelBuilderProps {
  sessionId: string;
  onCanvasUpdate?: (canvasData: any) => void;
  onElementAdd?: (element: CanvasElement) => void;
}

const BUSINESS_MODEL_ELEMENTS: Omit<CanvasElement, 'id' | 'position'>[] = [
  {
    type: 'customer_segments',
    title: 'Customer Segments',
    content: [],
    color: '#DBEAFE',
    icon: <Users className="w-5 h-5" />
  },
  {
    type: 'value_propositions',
    title: 'Value Propositions',
    content: [],
    color: '#D1FAE5',
    icon: <Heart className="w-5 h-5" />
  },
  {
    type: 'channels',
    title: 'Channels',
    content: [],
    color: '#FEF3C7',
    icon: <ShoppingCart className="w-5 h-5" />
  },
  {
    type: 'customer_relationships',
    title: 'Customer Relationships',
    content: [],
    color: '#FCE7F3',
    icon: <Target className="w-5 h-5" />
  },
  {
    type: 'revenue_streams',
    title: 'Revenue Streams',
    content: [],
    color: '#E0E7FF',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    type: 'key_resources',
    title: 'Key Resources',
    content: [],
    color: '#F3E8FF',
    icon: <Key className="w-5 h-5" />
  },
  {
    type: 'key_activities',
    title: 'Key Activities',
    content: [],
    color: '#FEF2F2',
    icon: <Settings className="w-5 h-5" />
  },
  {
    type: 'key_partnerships',
    title: 'Key Partnerships',
    content: [],
    color: '#ECFDF5',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    type: 'cost_structure',
    title: 'Cost Structure',
    content: [],
    color: '#FEF7CD',
    icon: <Zap className="w-5 h-5" />
  }
];

export default function VisualBusinessModelBuilder({
  sessionId,
  onCanvasUpdate,
  onElementAdd
}: VisualBusinessModelBuilderProps) {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [newContent, setNewContent] = useState('');

  // Initialize canvas with default layout
  useEffect(() => {
    const initialElements = BUSINESS_MODEL_ELEMENTS.map((element, index) => ({
      ...element,
      id: `${element.type}-${index}`,
      position: getDefaultPosition(element.type, index)
    }));
    setCanvasElements(initialElements);
  }, []);

  const getDefaultPosition = (type: string, index: number) => {
    // Create a grid layout for the business model canvas
    const positions = [
      { x: 50, y: 50 },   // Customer Segments (top-left)
      { x: 300, y: 50 },  // Value Propositions (top-center)
      { x: 550, y: 50 },  // Channels (top-right)
      { x: 50, y: 200 },  // Customer Relationships (middle-left)
      { x: 300, y: 200 }, // Revenue Streams (center)
      { x: 550, y: 200 }, // Key Resources (middle-right)
      { x: 50, y: 350 },  // Key Activities (bottom-left)
      { x: 300, y: 350 }, // Key Partnerships (bottom-center)
      { x: 550, y: 350 }  // Cost Structure (bottom-right)
    ];
    return positions[index] || { x: 50, y: 50 };
  };

  const handleElementClick = (element: CanvasElement) => {
    setSelectedElement(element);
    setIsAddingContent(true);
  };

  const handleAddContent = () => {
    if (!selectedElement || !newContent.trim()) return;

    const updatedElements = canvasElements.map(element =>
      element.id === selectedElement.id
        ? { ...element, content: [...element.content, newContent.trim()] }
        : element
    );

    setCanvasElements(updatedElements);
    setNewContent('');
    setIsAddingContent(false);
    setSelectedElement(null);

    // Notify parent of canvas update
    onCanvasUpdate?.(updatedElements);
  };

  const handleRemoveContent = (elementId: string, contentIndex: number) => {
    const updatedElements = canvasElements.map(element =>
      element.id === elementId
        ? { ...element, content: element.content.filter((_, index) => index !== contentIndex) }
        : element
    );

    setCanvasElements(updatedElements);
    onCanvasUpdate?.(updatedElements);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Business Model Canvas</h2>
        <p className="text-sm text-gray-600">Click on elements to add your business model details</p>
      </div>

      <div className="flex-1 flex">
        {/* Element Palette */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Business Model Elements</h3>
          <div className="space-y-2">
            {BUSINESS_MODEL_ELEMENTS.map((element, index) => (
              <div
                key={element.type}
                className="p-3 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                style={{
                  backgroundColor: element.color,
                  borderColor: element.color.replace('bg-', 'border-')
                }}
                onClick={() => handleElementClick(canvasElements[index])}
              >
                <div className="flex items-center space-x-2">
                  <div className="text-gray-600">{element.icon}</div>
                  <span className="text-sm font-medium text-gray-900">{element.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full bg-gray-50 relative" style={{ minHeight: '600px' }}>
            {canvasElements.map((element, index) => (
              <motion.div
                key={element.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all duration-200"
                style={{
                  backgroundColor: element.color,
                  borderColor: element.color.replace('bg-', 'border-'),
                  left: element.position.x,
                  top: element.position.y,
                  width: '200px',
                  minHeight: '120px'
                }}
                onClick={() => handleElementClick(element)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-600">{element.icon}</div>
                    <h4 className="text-sm font-semibold text-gray-900">{element.title}</h4>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {element.content.map((item, contentIndex) => (
                    <div key={contentIndex} className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">{item}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContent(element.id, contentIndex);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                {element.content.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Click to add content</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Addition Modal */}
      <AnimatePresence>
        {isAddingContent && selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsAddingContent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Add to {selectedElement.title}
              </h3>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter content..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                autoFocus
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsAddingContent(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 