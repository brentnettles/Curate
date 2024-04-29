import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import centerIcon from '../buttons/center.png';
import '../Style/Map.css';
import ArtworkDisplay from './ArtworkDisplay';
import { useAuth } from '../contexts/AuthContext';

function Map_visual() {
    const svgRef = useRef();
    const [selectedGallery, setSelectedGallery] = useState(null);
    const { savedArtworks } = useAuth(); // Access saved artworks from the Auth context
    const zoom = useRef(d3.zoom().scaleExtent([1, 8]));  

    useEffect(() => {
        fetch("/MetMap.svg")
            .then(res => res.text())
            .then(svg => {
                svgRef.current.innerHTML = svg;
                const svgElement = svgRef.current.querySelector('svg');
                enhanceSVG(svgElement);
                highlightSavedGalleries(); // Ensures highlights are updated on fetch and context changes
            });
    }, [savedArtworks]); // Add savedArtworks as a dependency to update when changes

    const enhanceSVG = (svgElement) => {
        const svg = d3.select(svgElement);

        // Set up zoom
        zoom.current.on('zoom', (event) => {
            svg.select('#Layer_1').attr('transform', event.transform);
            svg.select('#Floor_1_Galleries').attr('transform', event.transform);
        });

        svg.call(zoom.current);
        svg.call(zoom.current.transform, d3.zoomIdentity);

        // Set up gallery interactions
        const galleriesLayer = svg.select('#Floor_1_Galleries');
        galleriesLayer.selectAll('rect')
            .each(function () {
                const rect = d3.select(this);
                const id = rect.attr('id').replace(/[_]/g, '');
                const originalColor = rect.style('fill');  // Store the original fill color
                const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
                d3.select(group).attr('class', 'room-group')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        setSelectedGallery(id);
                    })
                    .on('mouseover', function() {
                        d3.select(this).select('rect')
                            .transition()
                            .duration(150)
                            .style('fill', 'salmon');  // Change hover color
                    })
                    .on('mouseout', function() {
                        d3.select(this).select('rect')
                            .transition()
                            .duration(150)
                            .style('fill', originalColor);  // Revert fill color
                    });

                group.appendChild(rect.node());  // Append rectangle to group

                // Append text to group
                d3.select(group).append('text')
                    .attr('x', parseFloat(rect.attr('x')) + parseFloat(rect.attr('width')) / 2)
                    .attr('y', parseFloat(rect.attr('y')) + parseFloat(rect.attr('height')) / 2)
                    .attr('dominant-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .text(id)
                    .style('fill', 'black')
                    .style('font-size', `${Math.min(parseFloat(rect.attr('width')), parseFloat(rect.attr('height'))) / 3}px`);

                // Highlight if saved
                if (savedArtworks.has(id)) {
                    rect.style('stroke', 'red').style('stroke-width', '4');
                }
            });
    };

    const highlightSavedGalleries = () => {
        const svg = d3.select(svgRef.current).select('svg');
        const galleriesLayer = svg.select('#Floor_1_Galleries');
        galleriesLayer.selectAll('rect').each(function () {
            const rect = d3.select(this);
            const id = rect.attr('id').replace(/[_]/g, '');  // Ensure the ID is cleaned properly
            if (savedArtworks.has(id)) {
                rect.style('stroke', 'red').style('stroke-width', '4'); // Highlight saved galleries
            } else {
                rect.style('stroke', 'none');
            }
        });
    };

    const recenterSVG = (event) => {
        event.stopPropagation(); 
        const svgElement = svgRef.current.querySelector('svg');
        d3.select(svgElement).transition().duration(750).call(zoom.current.transform, d3.zoomIdentity);
    };

    return (
        <div className="main-container"> 
            <div className="floorplan-container" style={{ position: 'relative' }}>
                <div ref={svgRef} className="floorplan-svg-container" />
                <button
                    id="recenter-button"
                    onClick={recenterSVG}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        background: `url(${centerIcon}) no-repeat center center`,
                        backgroundSize: 'cover',
                        width: '50px',
                        height: '50px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                ></button>
                <div className="artwork-display-container">
                    {selectedGallery && <ArtworkDisplay galleryNumber={selectedGallery} />}
                </div>
            </div>
        </div>
    );
}

export default Map_visual;
