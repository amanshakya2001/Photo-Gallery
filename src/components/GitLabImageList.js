// src/components/GitLabImageList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageGallery from "react-image-gallery";
import '../../node_modules/react-image-gallery/styles/css/image-gallery.css'

const GitLabImageList = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const personalAccessToken = 'glpat-yMBHG5xH9rBcjDQ3jyYX';
    const projectPath = 'crazyboy2/personal-stuff'; // Replace with your project path
    const branchName = 'master'; // Replace with your desired branch name
    const baseUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
      projectPath
    )}`;

    const fetchImagesRecursively = async (directoryPath = '') => {
      const directoryUrl = `${baseUrl}/repository/tree?path=${directoryPath}&ref=${branchName}`;
      try {
        const response = await axios.get(directoryUrl, {
          headers: {
            'PRIVATE-TOKEN': personalAccessToken,
          },
        });

        const files = response.data.filter((item) => item.type === 'blob');
        const imageFiles = files.filter((item) =>
          item.name.match(/\.(jpg|jpeg|png|gif)$/i)
        );

        const imageUrls = imageFiles.map(
          (image) =>
            `https://gitlab.com/${projectPath}/raw/${branchName}/${image.path}`
        );

        const dict_list = []
        imageUrls.map((elements)=>{
          let dict = {
            original: elements,
            thumbnail: elements,
          }
          dict_list.push(dict)
        })

        setImageUrls((prevUrls) => [...prevUrls, ...dict_list]);

        const subdirectories = response.data.filter(
          (item) => item.type === 'tree'
        );
        for (const subdirectory of subdirectories) {
          await fetchImagesRecursively(
            `${directoryPath}${directoryPath ? '/' : ''}${subdirectory.name}`
          );
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImagesRecursively(); // Start fetching images from the root directory

  }, []);

  return (
    <ImageGallery originalHeight={'100vh'} loading="lazy" items={imageUrls} />
  );
};

export default GitLabImageList;
