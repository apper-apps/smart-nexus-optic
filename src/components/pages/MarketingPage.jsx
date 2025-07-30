import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import EmailBuilder from "@/components/organisms/EmailBuilder";
import { campaignService } from "@/services/api/campaignService";
import { toast } from 'react-toastify';
import { format } from 'date-fns';
function MarketingPage({ onMobileMenuToggle }) {
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    draftCampaigns: 0,
    sentCampaigns: 0,
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    avgOpenRate: 0,
    avgClickRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
const [formData, setFormData] = useState({
    name: '',
    subject: '',
    type: 'broadcast',
    status: 'draft',
    emailContent: {
      blocks: [],
      settings: {
        backgroundColor: '#ffffff',
        contentWidth: 600,
        padding: 20
      }
    }
  });
  const [showEmailBuilder, setShowEmailBuilder] = useState(false);

  useEffect(() => {
    loadCampaigns();
    loadMetrics();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns');
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await campaignService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'sent': return 'secondary';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      type: campaign.type,
      status: campaign.status,
      emailContent: campaign.emailContent || {
        blocks: [],
        settings: {
          backgroundColor: '#ffffff',
          contentWidth: 600,
          padding: 20
        }
      }
    });
    setShowEditModal(true);
  };

  const handleLaunchCampaign = async (campaignId) => {
    try {
      await campaignService.launch(campaignId);
      loadCampaigns();
      loadMetrics();
    } catch (err) {
      toast.error(err.message || 'Failed to launch campaign');
    }
  };

  const handlePauseCampaign = async (campaignId) => {
    try {
      await campaignService.pause(campaignId);
      loadCampaigns();
      loadMetrics();
    } catch (err) {
      toast.error(err.message || 'Failed to pause campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignService.delete(campaignId);
      loadCampaigns();
      loadMetrics();
    } catch (err) {
      toast.error(err.message || 'Failed to delete campaign');
    }
  };

const handleSubmit = async () => {
    try {
      if (showCreateModal) {
        await campaignService.create(formData);
      } else {
        await campaignService.update(editingCampaign.Id, formData);
      }
      handleCloseModal();
      loadCampaigns();
      loadMetrics();
    } catch (err) {
      toast.error(err.message || 'Failed to save campaign');
    }
  };

  const handleOpenEmailBuilder = () => {
    setShowEmailBuilder(true);
  };

  const handleEmailContentSave = (emailContent) => {
    setFormData({ ...formData, emailContent });
    setShowEmailBuilder(false);
    toast.success('Email design saved successfully!');
  };

const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingCampaign(null);
    setShowEmailBuilder(false);
    setFormData({
      name: '',
      subject: '',
      type: 'broadcast',
      status: 'draft',
      emailContent: {
        blocks: [],
        settings: {
          backgroundColor: '#ffffff',
          contentWidth: 600,
          padding: 20
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Marketing" 
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Main Content */}
<div className="flex-1 p-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalCampaigns}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <ApperIcon name="Mail" className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeCampaigns}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-success-100 to-success-200 rounded-full flex items-center justify-center">
                <ApperIcon name="Play" className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.avgOpenRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-info-100 to-info-200 rounded-full flex items-center justify-center">
                <ApperIcon name="Eye" className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.avgClickRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center">
                <ApperIcon name="MousePointer" className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Campaign Management */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Email Campaigns</h2>
<Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="sent">Sent</option>
            </Select>
          </div>

          {/* Campaign Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ApperIcon name="AlertCircle" className="h-12 w-12 text-error-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Mail" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No campaigns found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Sent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Open Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Click Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-sm text-gray-600">{campaign.subject}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-gray-600">{campaign.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">{campaign.sent.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-900">{campaign.openRate}%</span>
                          {campaign.sent > 0 && (
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(campaign.openRate, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-900">{campaign.clickRate}%</span>
                          {campaign.sent > 0 && (
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(campaign.clickRate, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            <ApperIcon name="Edit" size={14} />
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLaunchCampaign(campaign.Id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <ApperIcon name="Play" size={14} />
                            </Button>
                          )}
                          {campaign.status === 'active' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePauseCampaign(campaign.Id)}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <ApperIcon name="Pause" size={14} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCampaign(campaign.Id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

{/* Create/Edit Campaign Modal */}
        {(showCreateModal || showEditModal) && !showEmailBuilder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showCreateModal ? 'Create New Campaign' : 'Edit Campaign'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter campaign name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter email subject"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Type
                    </label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full"
                    >
                      <option value="broadcast">Broadcast</option>
                      <option value="automated">Automated</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="survey">Survey</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="sent">Sent</option>
                    </Select>
                  </div>
                </div>
                
                {/* Email Design Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Design
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.emailContent.blocks.length > 0 
                          ? `${formData.emailContent.blocks.length} blocks configured`
                          : 'No email design created yet'
                        }
                      </p>
                    </div>
                    <Button
                      onClick={handleOpenEmailBuilder}
                      className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white"
                    >
                      <ApperIcon name="Mail" size={16} className="mr-2" />
                      Design Email
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                  disabled={!formData.name || !formData.subject}
                >
                  {showCreateModal ? 'Create Campaign' : 'Update Campaign'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Email Builder Modal */}
        {showEmailBuilder && (
          <EmailBuilder
            emailContent={formData.emailContent}
            onSave={handleEmailContentSave}
onClose={() => setShowEmailBuilder(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MarketingPage;