class Project < ApplicationRecord
    belongs_to :author, :class_name => "User"

    has_many :rectangles
    has_many :notes, through: :rectangles

    has_many :likes
    has_many :admirers, through: :likes, :class_name => "User"

end
 