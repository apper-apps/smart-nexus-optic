import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "@/components/atoms/Card";
import DealCard from "@/components/organisms/DealCard";
import ActionButton from "@/components/molecules/ActionButton";
import ApperIcon from "@/components/ApperIcon";
import { STAGE_ORDER } from "@/services/api/dealService";

const KanbanBoard = ({ 
  deals = [], 
  contacts = [], 
  companies = [], 
  onDealClick, 
  onDragEnd, 
  onCreateDeal 
}) => {
  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getCompanyById = (companyId) => {
    return companies.find(company => company.Id === companyId);
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageStats = (stage) => {
    const stageDeals = getDealsByStage(stage);
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    return {
      count: stageDeals.length,
      value: totalValue
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Prospect': return 'bg-gray-100 border-gray-300';
      case 'Qualified': return 'bg-info-50 border-info-200';
      case 'Proposal': return 'bg-warning-50 border-warning-200';
      case 'Negotiation': return 'bg-accent-50 border-accent-200';
      case 'Closed Won': return 'bg-success-50 border-success-200';
      case 'Closed Lost': return 'bg-error-50 border-error-200';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getStageHeaderColor = (stage) => {
    switch (stage) {
      case 'Prospect': return 'text-gray-700';
      case 'Qualified': return 'text-info-700';
      case 'Proposal': return 'text-warning-700';
      case 'Negotiation': return 'text-accent-700';
      case 'Closed Won': return 'text-success-700';
      case 'Closed Lost': return 'text-error-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales Pipeline</h2>
          <p className="text-sm text-gray-600">
            Manage your deals across different stages
          </p>
        </div>
        <ActionButton
          icon="Plus"
          variant="primary"
          onClick={onCreateDeal}
        >
          New Deal
        </ActionButton>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 min-w-max pb-4">
            {STAGE_ORDER.map((stage) => {
              const stageDeals = getDealsByStage(stage);
              const stats = getStageStats(stage);

              return (
                <div key={stage} className="flex-shrink-0 w-80">
                  <div className={`rounded-lg border-2 border-dashed h-full ${getStageColor(stage)}`}>
                    {/* Stage Header */}
                    <div className="p-4 border-b bg-white rounded-t-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${getStageHeaderColor(stage)}`}>
                          {stage}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            {stats.count}
                          </span>
                          <ApperIcon name="MoreHorizontal" className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(stats.value)} total
                      </div>
                    </div>

                    {/* Droppable Area */}
                    <Droppable droppableId={stage}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 space-y-3 min-h-[400px] transition-colors ${
                            snapshot.isDraggingOver 
                              ? 'bg-primary-50 border-primary-300' 
                              : ''
                          }`}
                        >
                          {stageDeals.map((deal, index) => {
                            const contact = getContactById(deal.contactId);
                            const company = getCompanyById(deal.companyId);

                            return (
                              <Draggable
                                key={deal.Id.toString()}
                                draggableId={deal.Id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <DealCard
                                      deal={deal}
                                      contact={contact}
                                      company={company}
                                      onClick={() => onDealClick(deal)}
                                      isDragging={snapshot.isDragging}
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}

                          {/* Empty State */}
                          {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <ApperIcon name="Plus" className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500">
                                No deals in {stage.toLowerCase()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;