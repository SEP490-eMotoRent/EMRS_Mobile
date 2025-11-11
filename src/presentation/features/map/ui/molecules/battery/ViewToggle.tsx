import React from 'react';
import { Button } from '../../atoms/buttons/Button';
import { Icon } from '../../atoms/icons/Icon';


export type ViewMode = 'map' | 'list';

interface ViewToggleProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
    className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
    currentView,
    onViewChange,
    className = '',
}) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            <Button
                variant={currentView === 'map' ? 'primary' : 'secondary'}
                onClick={() => onViewChange('map')}
                icon={<Icon name="map" size="sm" />}
                fullWidth
            >
                Map View
            </Button>
            <Button
                variant={currentView === 'list' ? 'primary' : 'secondary'}
                onClick={() => onViewChange('list')}
                icon={<Icon name="list" size="sm" />}
                fullWidth
            >
                List View
            </Button>
        </div>
    );
};