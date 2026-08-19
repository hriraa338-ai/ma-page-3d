'use client'

import { Suspense, lazy } from 'react'
import { SplineErrorBoundary } from '@/components/spline-error-boundary'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const loader = (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loader"></span>
    </div>
  )

  return (
    <SplineErrorBoundary fallback={loader}>
      <Suspense fallback={loader}>
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}
