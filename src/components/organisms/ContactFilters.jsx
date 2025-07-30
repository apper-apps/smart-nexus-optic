import React from "react";
import FilterSelect from "@/components/molecules/FilterSelect";
import ActionButton from "@/components/molecules/ActionButton";

const ContactFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  companies = []
}) => {
  const lifecycleOptions = [
    { value: "Lead", label: "Lead" },
    { value: "Prospect", label: "Prospect" },
    { value: "Customer", label: "Customer" }
  ];

  const companyOptions = companies.map(company => ({
    value: company.Id.toString(),
    label: company.name
  }));

  const hasActiveFilters = filters.lifecycleStage || filters.companyId;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          <FilterSelect
            label="Lifecycle Stage"
            value={filters.lifecycleStage}
            onChange={(e) => onFilterChange("lifecycleStage", e.target.value)}
            options={lifecycleOptions}
            placeholder="All Stages"
          />
          <FilterSelect
            label="Company"
            value={filters.companyId}
            onChange={(e) => onFilterChange("companyId", e.target.value)}
            options={companyOptions}
            placeholder="All Companies"
          />
          <div className="flex items-end">
            {hasActiveFilters && (
              <ActionButton
                icon="X"
                variant="ghost"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear Filters
              </ActionButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFilters;