'use client';

import React from 'react';
import HealthScoreDashboard from './HealthScoreDashboard';

/**
 * HealthScoreCard component wrapper
 * Forwards props to HealthScoreDashboard for full fintech visualization
 */
export default function HealthScoreCard(props) {
  return <HealthScoreDashboard {...props} />;
}

export { HealthScoreDashboard };
