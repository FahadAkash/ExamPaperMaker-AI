'use client';

import React from 'react';
import { ClassConfig } from '@/types';
import { classConfigs } from '@/lib/class-configs';
import { GraduationCap, BookOpen, Clock, Award } from 'lucide-react';

interface ClassSelectorProps {
  selectedClass: ClassConfig | null;
  selectedSubject: string;
  onClassChange: (classConfig: ClassConfig) => void;
  onSubjectChange: (subject: string) => void;
}

export function ClassSelector({ 
  selectedClass, 
  selectedSubject, 
  onClassChange, 
  onSubjectChange 
}: ClassSelectorProps) {
  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2 mb-3">
        <GraduationCap className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">Question Paper Configuration</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Class Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <select
            value={selectedClass?.id || ''}
            onChange={(e) => {
              const classConfig = classConfigs.find(c => c.id === e.target.value);
              if (classConfig) {
                onClassChange(classConfig);
                onSubjectChange(''); // Reset subject when class changes
              }
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a class...</option>
            {classConfigs.map((classConfig) => (
              <option key={classConfig.id} value={classConfig.id}>
                {classConfig.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        {selectedClass && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a subject...</option>
              {selectedClass.subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Class Details */}
        {selectedClass && (
          <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-1 text-blue-600" />
              Paper Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center text-gray-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>Time: {selectedClass.timeLimit}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="h-3 w-3 mr-1" />
                <span>Marks: {selectedClass.totalMarks}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Available Question Types:</p>
              <div className="flex flex-wrap gap-1">
                {selectedClass.questionTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}