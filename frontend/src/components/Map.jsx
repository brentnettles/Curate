import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import centerIcon from '../buttons/center.png';
import '../Style/Map.css';
import ArtworkDisplay from './ArtworkDisplay';
import { useAuth } from '../contexts/AuthContext';

function Map_visual() {
    const svgRef = useRef();
    const [selectedGallery, setSelectedGallery] = useState(null);
    const { user, savedArtworks } = useAuth();
    const zoom = useRef(d3.zoom().scaleExtent([1, 8]));

    useEffect(() => {
        fetch("/MetMap.svg")
            .then(res => res.text())
            .then(svg => {
                svgRef.current.innerHTML = svg;
                const svgElement = svgRef.current.querySelector('svg');
                enhanceSVG(svgElement);
            });
    }, []);

    useEffect(() => {
        const svgElement = svgRef.current.querySelector('svg');
        if (svgElement) {
            highlightSavedGalleries(svgElement);
        }
    }, [savedArtworks]);

    // d3 map overview~ svg:1 layer is map, 2nd layer is galleries
    // each rectangle in the svg has an id = to the galleryNumber
    // select the id, append as text to the rectangle
    // reference the galleryNumber in the id of the svg for highlightSavedGalleries function

    const enhanceSVG = (svgElement) => {
        const svg = d3.select(svgElement);
        zoom.current.on('zoom', (event) => {
            svg.select('#Layer_1').attr('transform', event.transform);
            svg.select('#Floor_1_Galleries').attr('transform', event.transform);
        });
        svg.call(zoom.current);
        svg.call(zoom.current.transform, d3.zoomIdentity);
        setupInteractions(svg);
    };

    const setupInteractions = (svg) => {
        const galleriesLayer = svg.select('#Floor_1_Galleries');
        galleriesLayer.selectAll('rect').each(function() {
            const rect = d3.select(this);
            const id = rect.attr('id').replace(/[_]/g, '');
            const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
            d3.select(group)
                .attr('class', 'room-group')
                .style('cursor', 'pointer')
                .on('click', () => setSelectedGallery(id))
                .on('mouseover', () => rect.transition().duration(150).style('fill', 'salmon'))
                .on('mouseout', () => {
                    // Check if the gallery is saved and reset fill color accordingly
                    const isSaved = Array.from(savedArtworks).some(art => art.galleryNumber === id);
                    rect.transition().duration(150).style('fill', isSaved ? 'rgba(255, 0, 0, 0.2)' : '');
                });
            group.appendChild(rect.node());
            d3.select(group).append('text')
                .attr('x', parseFloat(rect.attr('x')) + parseFloat(rect.attr('width')) / 2)
                .attr('y', parseFloat(rect.attr('y')) + parseFloat(rect.attr('height')) / 2)
                .attr('dominant-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .text(id)
                .style('fill', 'black')
                .style('font-size', `${Math.min(parseFloat(rect.attr('width')), parseFloat(rect.attr('height'))) / 3}px`);
        });
    };
    

    const highlightSavedGalleries = (svgElement) => {
        const svg = d3.select(svgElement);
        const galleriesLayer = svg.select('#Floor_1_Galleries');
        galleriesLayer.selectAll('rect').each(function() {
            const rect = d3.select(this);
            const id = rect.attr('id').replace(/[_]/g, '');
            const isSaved = Array.from(savedArtworks).some(art => art.galleryNumber === id);
            
            // Toggle the 'saved-gallery' class based on saved state
            rect.classed('saved-gallery', isSaved)
                .classed('normal-gallery', !isSaved);
    
            if (isSaved) {
                rect.style('stroke', 'black')
                    .style('stroke-width', '1')
                    .style('fill', 'rgba(255, 0, 0, 0.2)');  // Light red fill for saved
            } else {
                // Reset to no inline styles so class styles take over
                rect.style('stroke', null)
                    .style('stroke-width', null)
                    .style('fill', null);
            }
        });
    };


    const recenterSVG = (event) => {
        event.stopPropagation();
        d3.select(svgRef.current.querySelector('svg')).transition().duration(750).call(zoom.current.transform, d3.zoomIdentity);
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

// early version below 80% functionality

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import centerIcon from '../buttons/center.png';
// import '../Style/Map.css';
// import ArtworkDisplay from './ArtworkDisplay';
// import { useAuth } from '../contexts/AuthContext';

// function Map_visual() {
//     const svgRef = useRef();
//     const [selectedGallery, setSelectedGallery] = useState(null);
//     const { savedArtworks } = useAuth(); 
//     const zoom = useRef(d3.zoom().scaleExtent([1, 8]));  

//     useEffect(() => {
//         fetch("/MetMap.svg")
//             .then(res => res.text())
//             .then(svg => {
//                 svgRef.current.innerHTML = svg;
//                 const svgElement = svgRef.current.querySelector('svg');
//                 enhanceSVG(svgElement);
//             });
//     }, []); // Removed savedArtworks from the dependencies

//     useEffect(() => {
//         // This effect is only responsible for updating highlights
//         if (svgRef.current) {
//             highlightSavedGalleries();
//         }
//     }, [savedArtworks]); // Only re-run when savedArtworks changes

//     const enhanceSVG = (svgElement) => {
//         const svg = d3.select(svgElement);

//         // Set up zoom
//         zoom.current.on('zoom', (event) => {
//             svg.select('#Layer_1').attr('transform', event.transform);
//             svg.select('#Floor_1_Galleries').attr('transform', event.transform);
//         });

//         svg.call(zoom.current);
//         svg.call(zoom.current.transform, d3.zoomIdentity);

//         setupInteractions(svg);
//     };

//     const setupInteractions = (svg) => {
//         const galleriesLayer = svg.select('#Floor_1_Galleries');
//         galleriesLayer.selectAll('rect')
//             .each(function () {
//                 const rect = d3.select(this);
//                 const id = rect.attr('id').replace(/[_]/g, '');
//                 const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
//                 d3.select(group).attr('class', 'room-group')
//                     .style('cursor', 'pointer')
//                     .on('click', () => setSelectedGallery(id))
//                     .on('mouseover', () => rect.transition().duration(150).style('fill', 'salmon'))
//                     .on('mouseout', () => rect.transition().duration(150).style('fill', ''));
                
//                 group.appendChild(rect.node());  // Append rectangle to group

//                 //Append text to group
//                 d3.select(group).append('text')
//                     .attr('x', parseFloat(rect.attr('x')) + parseFloat(rect.attr('width')) / 2)
//                     .attr('y', parseFloat(rect.attr('y')) + parseFloat(rect.attr('height')) / 2)
//                     .attr('dominant-baseline', 'middle')
//                     .attr('text-anchor', 'middle')
//                     .text(id) // Display gallery number
//                     .style('fill', 'black')
//                     .style('font-size', `${Math.min(parseFloat(rect.attr('width')), parseFloat(rect.attr('height'))) / 3}px`);
//             });
//     };

//     const highlightSavedGalleries = () => {
//         const svg = d3.select(svgRef.current).select('svg');
//         const galleriesLayer = svg.select('#Floor_1_Galleries');
//         galleriesLayer.selectAll('rect').each(function () {
//             const rect = d3.select(this);
//             const id = rect.attr('id').replace(/[_]/g, '');
//             rect.style('stroke', savedArtworks.has(id) ? 'red' : 'none').style('stroke-width', savedArtworks.has(id) ? '4' : '0');
//         });
//     };

//     const recenterSVG = (event) => {
//         event.stopPropagation(); 
//         const svgElement = svgRef.current.querySelector('svg');
//         d3.select(svgElement).transition().duration(750).call(zoom.current.transform, d3.zoomIdentity);
//     };

//     return (
//         <div className="main-container"> 
//             <div className="floorplan-container" style={{ position: 'relative' }}>
//                 <div ref={svgRef} className="floorplan-svg-container" />
//                 <button
//                     id="recenter-button"
//                     onClick={recenterSVG}
//                     style={{
//                         position: 'absolute',
//                         right: '10px',
//                         top: '10px',
//                         background: `url(${centerIcon}) no-repeat center center`,
//                         backgroundSize: 'cover',
//                         width: '50px',
//                         height: '50px',
//                         border: 'none',
//                         cursor: 'pointer'
//                     }}
//                 ></button>
//                 <div className="artwork-display-container">
//                     {selectedGallery && <ArtworkDisplay galleryNumber={selectedGallery} />}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Map_visual;
