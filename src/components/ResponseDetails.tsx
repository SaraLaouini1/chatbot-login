import { useState } from 'react';

export default function ResponseDetails({ details, isMobile }: { 
    details: {
        anonymizedPrompt: string;
        raw: string;
        final: string;
    }
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="response-details">
            <button 
                style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
              >
                {expanded ? '▲ Hide' : '▼ Details'}
            </button>
                    
            {expanded && (
                <div className="processing-steps" style={{ 
                      padding: isMobile ? '0.5rem' : '1rem',
                      fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}>
                    <div className="step">
                        <h4>Anonymized Prompt</h4>
                        <div className="content-block">
                            {details.anonymizedPrompt}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>LLM Raw Response</h4>
                        <div className="content-block">
                            {details.raw}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>After Recontextualization</h4>
                        <div className="content-block">
                            {details.final}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
