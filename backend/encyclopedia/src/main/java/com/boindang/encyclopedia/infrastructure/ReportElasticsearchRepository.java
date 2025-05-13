package com.boindang.encyclopedia.infrastructure;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.boindang.encyclopedia.domain.ReportDocument;

@Repository
public interface ReportElasticsearchRepository extends ElasticsearchRepository<ReportDocument, String> {
	List<ReportDocument> findByNameIn(List<String> names);
}
