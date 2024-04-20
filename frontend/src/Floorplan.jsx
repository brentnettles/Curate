import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ArtworkDisplay from './ArtworkDisplay';

function Floorplan() {
    const svgRef = useRef();
    const [selectedGallery, setSelectedGallery] = useState(null);

    useEffect(() => {
        fetch("/floorplan.svg")
            .then(res => res.text())
            .then(svg => {
                svgRef.current.innerHTML = svg;
                const svgElement = svgRef.current.querySelector('svg');
                enhanceSVG(svgElement);
            });
    }, []);

    const enhanceSVG = (svgElement) => {
        const svg = d3.select(svgElement);
        const width = 1000;
        const height = 800;

        // Set attributes for SVG
        svg.attr('viewBox', "0 0 1920 1080")
           .attr('width', width)
           .attr('height', height);

        // Configure zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                svg.select('#Layer_background').attr('transform', event.transform);
                svg.select('#Layer_rooms').attr('transform', event.transform);
            });

        svg.call(zoom);

        // Handle room group creation and interaction
        const roomsLayer = svg.select('#Layer_rooms');
        roomsLayer.selectAll('rect')
            .each(function() {
                const rect = d3.select(this);
                const x = parseFloat(rect.attr('x'));
                const y = parseFloat(rect.attr('y'));
                const width = parseFloat(rect.attr('width'));
                const height = parseFloat(rect.attr('height'));
                const galleryNumber = rect.attr('data-gallery-number');

                // Create a group for each room
                const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
                d3.select(group).attr('class', 'room-group')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        console.log(`Gallery ${galleryNumber} clicked!`);
                        setSelectedGallery(galleryNumber);
                    });

                // Move rectangle into the group
                group.appendChild(rect.node());

                // Add text label to the group
                d3.select(group).append('text')
                    .attr('x', x + width / 2)
                    .attr('y', y + height / 2)
                    .attr('dominant-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .text(galleryNumber)
                    .style('font-size', '12px')
                    .style('fill', 'black');
            });
    };

    return (
        <div>
            <div ref={svgRef} style={{ width: "1000px", height: "800px", border: '1px solid black' }} />
            {selectedGallery && <ArtworkDisplay galleryNumber={selectedGallery} />}
        </div>
    );
}

export default Floorplan;
