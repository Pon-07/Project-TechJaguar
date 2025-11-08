import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Grid, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Warehouse } from '../../data/warehouses';

interface TalukSelectorProps {
  warehouses: Warehouse[];
  selectedTaluks: string[];
  onTalukSelect: (taluks: string[]) => void;
  viewMode: 'map' | 'tiles';
  onViewModeChange: (mode: 'map' | 'tiles') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

export function TalukSelector({
  warehouses,
  selectedTaluks,
  onTalukSelect,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle
}: TalukSelectorProps) {
  const [showMultiSelect, setShowMultiSelect] = useState(false);

  // Get unique taluks with counts
  const talukCounts = warehouses.reduce((acc, warehouse) => {
    acc[warehouse.taluk] = (acc[warehouse.taluk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taluks = Object.keys(talukCounts).sort();

  const handleTalukToggle = (taluk: string) => {
    if (selectedTaluks.includes(taluk)) {
      onTalukSelect(selectedTaluks.filter(t => t !== taluk));
    } else {
      onTalukSelect([...selectedTaluks, taluk]);
    }
  };

  const filters = [
    { id: 'zomato', label: 'Zomato Enabled', color: 'bg-orange-100 text-orange-800' },
    { id: 'organic', label: 'Organic Only', color: 'bg-green-100 text-green-800' },
    { id: 'low-stock', label: 'Low Stock', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="space-y-4">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search warehouses, crops, or taluks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('map')}
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Map
          </Button>
          <Button
            variant={viewMode === 'tiles' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('tiles')}
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            Tiles
          </Button>
        </div>
      </div>

      {/* Taluk Selection and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium">Select Taluk(s):</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMultiSelect(!showMultiSelect)}
              className="text-xs"
            >
              {showMultiSelect ? 'Single Select' : 'Multi Select'}
            </Button>
          </div>
          
          {showMultiSelect ? (
            <Card className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {taluks.map((taluk) => (
                  <motion.div
                    key={taluk}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedTaluks.includes(taluk) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTalukToggle(taluk)}
                      className="w-full justify-between text-xs"
                    >
                      <span className="truncate">{taluk}</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {talukCounts[taluk]}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </div>
              {selectedTaluks.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedTaluks.length} taluk(s) selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTalukSelect([])}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Select
              value={selectedTaluks[0] || 'all'}
              onValueChange={(value) => onTalukSelect(value === 'all' ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select taluk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Taluks</SelectItem>
                {taluks.map((taluk) => (
                  <SelectItem key={taluk} value={taluk}>
                    {taluk} ({talukCounts[taluk]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="w-full sm:w-48">
          <label className="text-sm font-medium block mb-2">Sort by:</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="occupancy">Occupancy</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        {filters.map((filter) => (
          <motion.div
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={activeFilters.includes(filter.id) ? 'default' : 'outline'}
              className={`cursor-pointer ${
                activeFilters.includes(filter.id) ? filter.color : ''
              }`}
              onClick={() => onFilterToggle(filter.id)}
            >
              {filter.label}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Selected Summary */}
      {selectedTaluks.length > 0 && (
        <Card className="p-3 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Viewing {selectedTaluks.length} taluk(s): {selectedTaluks.join(', ')}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTalukSelect([])}
              className="text-green-700 hover:text-green-800"
            >
              Show All
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}