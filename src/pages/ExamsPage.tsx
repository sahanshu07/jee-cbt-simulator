import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Layout } from '@/components/layout';
import { Card, Button, Input, Alert, Badge } from '@/components/ui';
import { createSampleExam, parseMockTestJSON } from '@/utils';
import { ExamConfig } from '@/types';
import { Upload, Plus } from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { exams, loadExams, addExam, startExam } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const handleCreateSampleExam = async () => {
    const { exam, questions } = createSampleExam();
    await addExam(exam, questions);
    setShowCreateModal(false);
    loadExams();
  };

  const handleImportExam = async () => {
    if (!jsonInput.trim()) {
      setImportError('Please enter exam JSON');
      return;
    }

    setIsImporting(true);
    try {
      const { exam, questions } = parseMockTestJSON(jsonInput);
      await addExam(exam, questions);
      setJsonInput('');
      setImportError(null);
      setShowCreateModal(false);
      loadExams();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import exam');
    } finally {
      setIsImporting(false);
    }
  };

  const handleStartExam = async (examId: string) => {
    await startExam(examId);
    navigate('/exam');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exams</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create or import mock tests</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Exam
          </Button>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <Card key={exam.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{exam.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exam.description}</p>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{exam.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{exam.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Marks:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{exam.totalMarks}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {Object.entries(exam.questionsBySubject).map(([subject, count]) => (
                  <Badge key={subject} text={`${subject}: ${count}`} variant="info" size="sm" />
                ))}
              </div>

              <Button
                onClick={() => handleStartExam(exam.id)}
                className="w-full"
              >
                Start Exam
              </Button>
            </Card>
          ))}
        </div>

        {exams.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No exams yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first mock test or import from JSON</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Exam</Button>
          </Card>
        )}
      </div>

      {/* Create/Import Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create or Import Exam</h2>

              {importError && (
                <Alert type="error" title="Import Error" message={importError} onClose={() => setImportError(null)} />
              )}

              <div className="space-y-4">
                {/* Sample Exam */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Option 1: Create Sample Exam</label>
                  <Button
                    onClick={handleCreateSampleExam}
                    variant="secondary"
                    className="w-full"
                  >
                    Create Sample Mock Test
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">Or</span>
                  </div>
                </div>

                {/* JSON Import */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Option 2: Import from JSON</label>
                  <textarea
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                    placeholder='{\n  "name": "JEE Advanced Mock",\n  "duration": 150,\n  "questions": [...]\n}'
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 font-mono text-sm h-32 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setJsonInput('');
                    setImportError(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportExam}
                  isLoading={isImporting}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Exam
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
};
