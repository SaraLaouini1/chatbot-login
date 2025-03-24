import { useState } from 'react';

export default function ResponseDetails({ details }: { 
    details: {
        raw: string;
        afterRecontext: string;
        final: string;
    }
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="response-details">
            <button 
                onClick={() => setExpanded(!expanded)}
                className="toggle-details"
            >
                {expanded ? '▲ Hide Details' : '▼ Show Processing Details'}
            </button>
            
            {expanded && (
                <div className="processing-steps">
                    <div className="step">
                        <h4>LLM Raw Response</h4>
                        <div className="content-block">
                            {details.raw}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>After Recontextualization</h4>
                        <div className="content-block">
                            {details.afterRecontext}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>Final Cleaned Response</h4>
                        <div className="content-block">
                            {details.final}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
