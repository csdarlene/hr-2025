// UserMapper.java
package com.qualogy.hr.mapper;

import com.qualogy.hr.dto.response.UserResponse;
import com.qualogy.hr.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    @Mapping(target = "managerId", source = "manager.id")
    @Mapping(target = "managerName", expression = "java(user.getManager() != null ? user.getManager().getFullName() : null)")
    UserResponse toDto(User user);
}