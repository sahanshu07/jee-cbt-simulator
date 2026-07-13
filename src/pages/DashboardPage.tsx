import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Layout } from '@/components/layout';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { calculateAccuracy } from '@/utils';
import { ArrowRight, Plus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { exams, attemptHistory, loadExams } = useAppStore();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalExams: 0,
  });

  useEffect(() => {
    loadExams();

    // Calculate stats
    const attempts = attemptHistory || [];
    if (attempts.length > 0) {
      const totalMarks = attempts.reduce((sum, a) => sum + (a.obtainedMarks || 0), 0);
      const maxMarks = attempts.reduce((sum, a) => sum + (a.totalMarks || 0), 0);
      const scores = attempts.map(a => a.obtainedMarks || 0);

      setStats({
        totalAttempts: attempts.length,
        averageScore: Math.round(totalMarks / attempts.length),
        bestScore: Math.max(...scores),
        totalExams: exams.length,
      });
    }
  }, [loadExams, exams.length, attemptHistory]);

  const recentAttempts = (attemptHistory || []).slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your exam performance</p>
          </div>
          <Button onClick={() => navigate('/exams')} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Start Exam
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalAttempts}</p>
              </div>
              <div className="text-4xl opacity-20">📝</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.averageScore}</p>
              </div>
              <div className="text-4xl opacity-20">📊</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Score</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.bestScore}</p>
              </div>
              <div className="text-4xl opacity-20">⭐</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Exams</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.totalExams}</p>
              </div>
              <div className="text-4xl opacity-20">📚</div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Attempts */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Attempts</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/results')}>
                  View All
                </Button>
              </div>

              {recentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {recentAttempts.map((attempt, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/results/${attempt.id}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{attempt.examName}</h3>
                        <Badge text={`${attempt.obtainedMarks}/${attempt.totalMarks}`} variant="info" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                          View Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No attempts yet</p>
                  <Button onClick={() => navigate('/exams')} className="flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />
                    Start Your First Exam
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Stats</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Accuracy</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">75%</span>
                  </div>
                  <ProgressBar percentage={75} size="sm" showLabel={false} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Physics</span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">72%</span>
                  </div>
                  <ProgressBar percentage={72} size="sm" showLabel={false} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Chemistry</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">78%</span>
                  </div>
                  <ProgressBar percentage={78} size="sm" showLabel={false} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mathematics</span>
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">82%</span>
                  </div>
                  <ProgressBar percentage={82} size="sm" showLabel={false} />
                </div>
              </div>
            </Card>

            {/* Call to Action */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ready for more?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Take another mock test to improve your skills
              </p>
              <Button onClick={() => navigate('/exams')} className="w-full">
                Start Exam
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
