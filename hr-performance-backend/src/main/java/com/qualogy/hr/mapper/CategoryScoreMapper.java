// CategoryScoreMapper.java
package com.qualogy.hr.mapper;

import com.qualogy.hr.dto.request.CategoryScoreRequest;
import com.qualogy.hr.dto.response.CategoryScoreResponse;
import com.qualogy.hr.model.CategoryScore;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryScoreMapper {
    CategoryScoreMapper INSTANCE = Mappers.getMapper(CategoryScoreMapper.class);
    
    @Mapping(target = "evaluation", ignore = true)
    CategoryScore toEntity(CategoryScoreRequest dto);
    
    CategoryScoreResponse toDto(CategoryScore categoryScore);
}
