import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Floorplan.css'; // Import CSS file
import ArtworkDisplay from './ArtworkDisplay';

function Floorplan() {
    const svgRef = useRef();
    const [selectedGallery, setSelectedGallery] = useState(null);

    useEffect(() => {
        fetch("/floorplan2.svg")
            .then(res => res.text())
            .then(svg => {
                svgRef.current.innerHTML = svg;
                const svgElement = svgRef.current.querySelector('svg');
                enhanceSVG(svgElement);
            });
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (selectedGallery && !svgRef.current.contains(event.target)) {
                setSelectedGallery(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [selectedGallery]);

    const enhanceSVG = (svgElement) => {
        const svg = d3.select(svgElement);
    
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                svg.select('#Layer_1').attr('transform', event.transform);
                svg.select('#Floor_1_Galleries').attr('transform', event.transform);
            });
    
        svg.call(zoom);
        svg.call(zoom.transform, d3.zoomIdentity); 
    
        const galleriesLayer = svg.select('#Floor_1_Galleries');
        galleriesLayer.selectAll('rect')
            .each(function () {
                const rect = d3.select(this);
                const id = rect.attr('id') ? rect.attr('id').replace(/[_]/g, '') : '___';
                const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
                d3.select(group).attr('class', 'room-group')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        setSelectedGallery(id);
                    });

                group.appendChild(rect.node());

                d3.select(group).append('text')
                    .attr('x', parseFloat(rect.attr('x')) + parseFloat(rect.attr('width')) / 2)
                    .attr('y', parseFloat(rect.attr('y')) + parseFloat(rect.attr('height')) / 2)
                    .attr('dominant-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .text(id)
                    .style('font-size', `${Math.min(parseFloat(rect.attr('width')), parseFloat(rect.attr('height'))) / 3}px`)
                    .style('fill', 'black');
            });
    };

    return (
        <div className="floorplan-container">
            <div ref={svgRef} className="floorplan-svg-container" />
            <div className="artwork-display-container">
                {selectedGallery && <ArtworkDisplay galleryNumber={selectedGallery} />}
            </div>
        </div>
    );
}

export default Floorplan;
