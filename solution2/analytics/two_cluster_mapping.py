# Edward Novikov, Harvard Medical School, Harvard SEAS
# 2021
import numpy as np
import pandas as pd
import os
# from matplotlib import pyplot as plt
# import seaborn as sns

# https://www.learndatasci.com/glossary/jaccard-similarity/
def jaccard_set(list1, list2):
    """Define Jaccard Similarity function for two sets"""
    intersection = len(list(set(list1).intersection(list2)))
    union = (len(list1) + len(list2)) - intersection
    return float(intersection) / union

# def intersction(list1, list2):
#     """Define Jaccard Similarity function for two sets"""
#     intersection = len(list(set(list1).intersection(list2)))
#     # union = (len(list1) + len(list2)) - intersection
#     return float(intersection)

def general_jaccard_map(cluster_methods_df, col_name1, col_name2):
    jac_ind_dict = {}
    for clus1 in np.unique(cluster_methods_df[col_name1]):
        ji_list = []
        for clus2 in np.unique(cluster_methods_df[col_name2]):
            #compte similarity (change to intersection function)
            ji = jaccard_set( cluster_methods_df[cluster_methods_df[col_name1] == clus1]['CellID'], 
                    cluster_methods_df[cluster_methods_df[col_name2] == clus2]['CellID'] )
            ji_list.append((clus2, ji))
        # Add to dictionary
        jac_ind_dict[f'{clus1}'] = ji_list

    # Full JI cluster heatmap
    ji_clustermap = {}
    for clus1_key, val in jac_ind_dict.items():
        ji_clustermap[clus1_key] = [x[1] for x in val]
    
    ji_clustermap = pd.DataFrame.from_dict(ji_clustermap)
    if col_name1 == 'hdbscan' or col_name2 == 'hdbscan':
        pass
    else:
        ji_clustermap.index += 1 # to match flowSOM clusters
    
    # Cluster mapping
    cluster_map = {}
    for clus1_key, val in jac_ind_dict.items():
        j_list = jac_ind_dict[clus1_key]
        cluster_map[clus1_key] = max(j_list, key=lambda x: x[1])
    
    return ji_clustermap, cluster_map

def get_alignment(clustering1, clustering2):
    cluster_path = 'data' # CHANGE
    cluster_methods = data = pd.read_csv('data/clusterings.csv');
    cluster_methods = pd.DataFrame(cluster_methods, columns=['CellID', clustering1, clustering2])

    # Remove HBDSCAN outliers
    if (clustering1 == 'hdbscan'):
        cluster_methods_no_outliers = cluster_methods[cluster_methods['hdbscan'] != -1]
    #if no HDBSCAN then we just do the same with the first method..
    else:
        cluster_methods_no_outliers = cluster_methods[cluster_methods[clustering1] != -1]

    inter_clustermap, inter_mapping = general_jaccard_map(cluster_methods_no_outliers, clustering1, clustering2)

    # Save Cluster Mapping to CSV File
    resultMapping = pd.DataFrame(inter_mapping).T.rename(columns={0:clustering2, 1:'JI'}).sort_values(by=clustering2)
    resultMapping.index.name = clustering1
    resultMapping[clustering2] = resultMapping[clustering2].astype(int)
    resultMapping.to_csv(os.path.join(cluster_path,'cluster_mapping.csv'))

    #return the mapping
    return resultMapping


def get_mapping_matrix(clustering1, clustering2):
    cluster_path = 'data' # CHANGE
    cluster_methods = data = pd.read_csv('data/clusterings.csv');
    cluster_methods = pd.DataFrame(cluster_methods, columns=['CellID', clustering1, clustering2])

    # Remove HBDSCAN outliers
    if (clustering1 == 'hdbscan'):
        cluster_methods_no_outliers = cluster_methods[cluster_methods['hdbscan'] != -1]
    #if no HDBSCAN then we just do the same with the first method..
    else:
        cluster_methods_no_outliers = cluster_methods[cluster_methods[clustering1] != -1]

    inter_clustermap, inter_mapping = general_jaccard_map(cluster_methods_no_outliers, clustering1, clustering2)

    #return the mapping
    return inter_clustermap

