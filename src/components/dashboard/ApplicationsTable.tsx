import React, { useState, useRef } from 'react';
import { Search, Filter, Edit3, Eye, Trash2, ExternalLink, ChevronLeft, ChevronRight, Briefcase, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { JobApplication } from '../../types/jobApplication';

interface ApplicationsTableProps {
  applications: JobApplication[];
  searchTerm: string;
  statusFilter: string;
  hoveredJob: string | null;
  onSearchTermChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onEditApplication: (application: JobApplication) => void;
  onViewJobDescription: (job: { title: string; company: string; description: string }) => void;
  onDeleteApplication: (id: string) => void;
  onJobHover: (id: string | null) => void;
  onUpdateApplicationStatus?: (id: string, status: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  searchTerm,
  statusFilter,
  hoveredJob,
  onSearchTermChange,
  onStatusFilterChange,
  onEditApplication,
  onViewJobDescription,
  onDeleteApplication,
  onJobHover,
  onUpdateApplicationStatus,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 320; // Width of each card + margin

  const handleQuickApply = async (application: JobApplication) => {
    try {
      const url = application.job_posting_url;
      if (url) {
        // Update status to 'applied' if currently 'not_applied'
        if (application.status === 'not_applied' && onUpdateApplicationStatus) {
          onUpdateApplicationStatus(application.id, 'APPLIED');
        }
        window.open(url, '_blank');
      } else {
        console.log('No application URL available');
      }
    } catch (error) {
      console.error('Error during quick apply:', error);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newIndex = Math.max(0, currentIndex - 1);
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const maxIndex = Math.max(0, filteredApplications.length - 3);
      const newIndex = Math.min(maxIndex, currentIndex + 1);
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'interview': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'offer': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatSafeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm relative">
      {/* Centered tooltip overlay */}
      {hoveredJob && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-lg z-50 pointer-events-none">
          {(() => {
            const application = filteredApplications.find(app => app.id === hoveredJob);
            if (!application) return null;
            
            return (
              <div className="space-y-2">
                <div className="font-semibold text-blue-300 text-sm">
                  {application.position} - {application.company_name}
                </div>
                {application.job_description && (
                  <div>
                    <p className="font-semibold text-yellow-300">Description:</p>
                    <p className="text-gray-200">{application.job_description.substring(0, 200)}...</p>
                  </div>
                )}
                {application.notes && (
                  <div>
                    <p className="font-semibold text-yellow-300">Notes:</p>
                    <p className="text-gray-200">{application.notes}</p>
                  </div>
                )}
                <p className="text-xs text-green-300 mt-2 font-medium">
                  {application.status === 'applied' 
                    ? 'Click to view job posting' 
                    : 'Click to apply to this job'
                  }
                </p>
              </div>
            );
          })()}
        </div>
      )}
      
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Applications ({filteredApplications.length})
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="not_applied">Not Applied</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {filteredApplications.length > 0 ? (
          <>
            {/* Carousel Navigation Buttons */}
            {filteredApplications.length > 3 && (
              <>
                <button
                  onClick={scrollLeft}
                  disabled={currentIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full p-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={currentIndex >= Math.max(0, filteredApplications.length - 3)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full p-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}

            {/* Carousel Content */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-6 px-6 py-6 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex-shrink-0 w-80 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 cursor-pointer"
                  onMouseEnter={() => onJobHover(application.id)}
                  onMouseLeave={() => onJobHover(null)}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {application.position}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                          <Briefcase size={16} className="mr-2" />
                          <span className="text-sm">{application.company_name}</span>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status || 'not_applied')}`}>
                        {(application.status || 'not_applied').replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar size={14} className="mr-2" />
                        <div>
                          <div className="text-xs font-medium">Applied</div>
                          <div>{formatSafeDate(application.application_date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock size={14} className="mr-2" />
                        <div>
                          <div className="text-xs font-medium">Updated</div>
                          <div>{formatSafeDate(application.updated_at)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Description Preview */}
                    {application.job_description && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {application.job_description.substring(0, 120)}...
                        </p>
                      </div>
                    )}

                    {/* Notes Preview */}
                    {application.notes && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                          "{application.notes.substring(0, 60)}..."
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="p-6 pt-0">
                    <div className="flex justify-between items-center space-x-2">
                      {/* Quick Apply Button */}
                      {application.job_posting_url && application.status === 'not_applied' && (
                        <button
                          onClick={() => handleQuickApply(application)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <ExternalLink size={14} className="mr-2" />
                          Apply Now
                        </button>
                      )}
                      
                      {application.job_posting_url && application.status !== 'not_applied' && (
                        <button
                          onClick={() => window.open(application.job_posting_url, '_blank')}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <ExternalLink size={14} className="mr-2" />
                          View Job
                        </button>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditApplication(application)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Application"
                        >
                          <Edit3 size={16} />
                        </button>
                        
                        {application.job_description && (
                          <button
                            onClick={() => onViewJobDescription({
                              title: application.position,
                              company: application.company_name,
                              description: application.job_description || ''
                            })}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="View Job Description"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => onDeleteApplication(application.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            {filteredApplications.length > 3 && (
              <div className="flex justify-center space-x-2 pb-6">
                {Array.from({ length: Math.ceil(filteredApplications.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollTo({
                          left: index * cardWidth,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      Math.floor(currentIndex / 3) === index
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' ? 'No applications match your filters.' : 'No applications yet. Add your first application!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Position & Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredApplications.map((application) => (
              <tr
                key={application.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onMouseEnter={() => onJobHover(application.id)}
                onMouseLeave={() => onJobHover(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.position}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {application.company_name}
                      </div>
                    </div>
                  </div>
                </td><td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status || 'not_applied')}`}>
                    {(application.status || 'not_applied').replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatSafeDate(application.application_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatSafeDate(application.last_updated)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2 relative">
                    <button
                      onClick={() => onEditApplication(application)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    
                    {application.job_description && (
                      <button                        onClick={() => onViewJobDescription({
                          title: application.position,
                          company: application.company_name,
                          description: application.job_description || ''
                        })}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDeleteApplication(application.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>                      {application.job_posting_url ? (
                      <button
                        onClick={() => handleQuickApply(application)}
                        className={`px-3 py-1 rounded text-xs flex items-center gap-1 transition-all font-medium ${
                          application.status === 'applied' 
                            ? 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        title={application.status === 'applied' ? 'View job posting' : 'Apply to this job'}
                      >
                        <ExternalLink size={12} />
                        {application.status === 'applied' ? 'View' : 'Apply'}
                      </button>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-xs">No link available</span>
                        <button
                          onClick={() => onEditApplication(application)}
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs flex items-center gap-1 transition-all"
                        >
                          <ExternalLink size={12} />
                          Add Linkexport default ApplicationsTable;
