import React, { useState } from 'react';
import { Rocket, ExternalLink } from 'lucide-react';

export const DeploySection: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [claimUrl, setClaimUrl] = useState<string | null>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      // Deploy to Netlify
      const response = await fetch('/api/deploy', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Deployment failed');
      }

      const data = await response.json();
      setDeployUrl(data.deploy_url);
      setClaimUrl(data.claim_url);
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Failed to deploy the application. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Deploy Application</h2>
      <p className="text-sm text-gray-500 mb-6">
        Deploy your application to make it accessible online
      </p>

      <div className="space-y-4">
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
            ${isDeploying 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          <Rocket className="w-4 h-4 mr-2" />
          {isDeploying ? 'Deploying...' : 'Deploy to Netlify'}
        </button>

        {deployUrl && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Your site is live at:</span>
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              {deployUrl}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}

        {claimUrl && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Want to manage this site?
            </h3>
            <p className="text-sm text-blue-600 mb-3">
              You can claim this site to manage it in your own Netlify account.
            </p>
            <a
              href={claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-700 hover:text-blue-900"
            >
              Claim this site
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};