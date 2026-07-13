import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Layout } from '@/components/layout';
import { Card, Button, Badge, ProgressBar, Tabs, Alert } from '@/components/ui';
import { calculateAccuracy, getSubjectColor, getSubjectLabel } from '@/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, Download, Share2 } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { getAttemptById } = useAppStore();
  const [attempt, setAttempt] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (attemptId) {
      const result = getAttemptById(attemptId);
      setAttempt(result);
    }
  }, [attemptId, getAttemptById]);

  if (!attempt) {
    return (
      <Layout>
        <Alert type="error" title="Not Found" message="Results not found" />
      </Layout>
    );
  }

  const totalMarks = attempt.totalMarks;
  const obtainedMarks = attempt.obtainedMarks || 0;
  const accuracy = calculateAccuracy(attempt.correctAnswers || 0, attempt.totalQuestions || 0);
  const answeredQuestions = Object.values(attempt.answers).filter((a: any) => a.answer !== undefined).length;
  
  const subjectStats = {
    PHYSICS: {
      total: 30,
      attempted: 0,
      correct: 0,
      marks: 0,
    },
    CHEMISTRY: {
      total: 30,
      attempted: 0,
      correct: 0,
      marks: 0,
    },
    MATHEMATICS: {
      total: 30,
      attempted: 0,
      correct: 0,
      marks: 0,
    },
  };

  // Calculate statistics (mock data for demo)
  const chartData = [
    { subject: 'Physics', marks: 80, percentage: 67 },
    { subject: 'Chemistry', marks: 95, percentage: 79 },
    { subject: 'Mathematics', marks: 110, percentage: 92 },
  ];

  const pieData = [
    { name: 'Correct', value: attempt.correctAnswers || 0, color: '#10b981' },
    { name: 'Incorrect', value: (attempt.totalQuestions || 90) - (attempt.correctAnswers || 0), color: '#ef4444' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/exams')}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Score Card */}
        <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {obtainedMarks}/{totalMarks}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Total Marks Obtained</p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{accuracy}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{answeredQuestions}/{attempt.totalQuestions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Answered</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs
          tabs={[
            { label: '📊 Overview', value: 'overview' },
            { label: '📈 Analysis', value: 'analysis' },
            { label: '✓ Solutions', value: 'solutions' },
          ]}
          defaultValue="overview"
          onChange={setActiveTab}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 mt-6">
              {/* Subject Performance */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Subject-wise Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {chartData.map(subject => (
                    <div key={subject.subject} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{subject.subject}</h4>
                      <ProgressBar percentage={subject.percentage} size="md" showLabel={false} />
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Marks</span>
                        <span className="font-bold text-gray-900 dark:text-white">{subject.marks}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600 dark:text-gray-400">Percentage</span>
                        <span className="font-bold text-gray-900 dark:text-white">{subject.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Statistics */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Exam Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">45</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect Answers</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">22</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unanswered</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">23</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time Taken</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">2h 15m</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-6 mt-6">
              {/* Charts */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="marks" fill="#4f46e5" name="Marks Obtained" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Attempt Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* Solutions Tab */}
          {activeTab === 'solutions' && (
            <div className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Review Your Answers</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Detailed solutions and explanations will appear here</p>
                <Button variant="secondary">Coming Soon</Button>
              </Card>
            </div>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};
