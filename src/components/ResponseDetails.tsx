import { useState } from 'react';

export default function ResponseDetails({ details, isMobile }: { 
    details: {
        anonymizedPrompt: string;
        raw: string;
        final: string;
    },
    isMobile: boolean
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="response-details">
            <button 
                onClick={() => setExpanded(!expanded)}
                className="toggle-details"
                style={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}
            >
                {expanded ? '▲ Hide' : `▼ ${isMobile ? 'Details' : 'Processing Details'}`}
            </button>
            
            {expanded && (
                <div className="processing-steps" style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
                    <div className="step">
                        <h4>Anonymized Prompt</h4>
                        <div className="content-block">{details.anonymizedPrompt}</div>
                    </div>
                    <div className="step">
                        <h4>LLM Raw Response</h4>
                        <div className="content-block">{details.raw}</div>
                    </div>
                    <div className="step">
                        <h4>Final Response</h4>
                        <div className="content-block">{details.final}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
